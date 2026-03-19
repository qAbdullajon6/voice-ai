import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { pool } from '../db';

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
};

type UserDeviceRow = {
  id: string;
  user_id: string;
  name: string | null;
  platform: string | null;
  user_agent: string | null;
  ip: string | null;
  created_at: string;
  last_used_at: string;
  revoked_at: string | null;
};

type GoogleProfile = {
  email: string;
  name?: string;
  picture?: string;
};

type DeviceInfo = {
  name?: string | null;
  platform?: string | null;
  userAgent?: string | null;
  ip?: string | null;
};

@Injectable()
export class AuthService {
  private jwtSecret() {
    return process.env.JWT_SECRET ?? 'change-me';
  }

  private jwtExpiresIn(): SignOptions['expiresIn'] {
    return (
      (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ??
      ('7d' as SignOptions['expiresIn'])
    );
  }

  private signAccessToken(user: UserRow, deviceId: string) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        deviceId,
        jti: randomUUID(),
      },
      this.jwtSecret(),
      { expiresIn: this.jwtExpiresIn() },
    );
  }

  private hashRefreshToken(refreshToken: string) {
    return createHash('sha256').update(refreshToken, 'utf8').digest('hex');
  }

  private generateRefreshToken() {
    // 48 bytes => 64-ish base64url chars
    return randomBytes(48).toString('base64url');
  }

  private toUser(row: UserRow) {
    return { id: row.id, email: row.email, name: row.name };
  }

  private async createDevice(userId: string, info: DeviceInfo) {
    const id = randomUUID();
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    const result = await pool.query<UserDeviceRow>(
      `
      INSERT INTO user_devices (id, user_id, name, platform, user_agent, ip, refresh_token_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, user_id, name, platform, user_agent, ip, created_at, last_used_at, revoked_at
      `,
      [
        id,
        userId,
        info.name ?? null,
        info.platform ?? null,
        info.userAgent ?? null,
        info.ip ?? null,
        refreshTokenHash,
      ],
    );

    return { device: result.rows[0], refreshToken };
  }

  async issueSession(user: UserRow, deviceInfo: DeviceInfo) {
    const { device, refreshToken } = await this.createDevice(user.id, deviceInfo);
    return {
      token: this.signAccessToken(user, device.id),
      refreshToken,
      device,
      user: this.toUser(user),
    };
  }

  private async rotateRefreshToken(deviceId: string) {
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const result = await pool.query<{ id: string }>(
      `
      UPDATE user_devices
      SET refresh_token_hash = $2, last_used_at = now()
      WHERE id = $1 AND revoked_at IS NULL
      RETURNING id
      `,
      [deviceId, refreshTokenHash],
    );

    if (!result.rowCount) {
      throw new UnauthorizedException('Session revoked');
    }
    return refreshToken;
  }

  async register(
    payload: { name?: string; email: string; password: string },
    deviceInfo: DeviceInfo,
  ) {
    const email = String(payload.email ?? '')
      .toLowerCase()
      .trim();
    const password = String(payload.password ?? '');
    const name = String(payload.name ?? '').trim() || null;

    if (!email || !password) {
      throw new BadRequestException('Email and password required');
    }

    const existing = await pool.query<UserRow>(
      'SELECT id, email, name, password_hash FROM users WHERE email = $1',
      [email],
    );
    if (existing.rowCount) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = randomUUID();
    const result = await pool.query<UserRow>(
      'INSERT INTO users (id, email, name, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, name, password_hash',
      [id, email, name, passwordHash],
    );

    const user = result.rows[0];
    return this.issueSession(user, deviceInfo);
  }

  async login(
    payload: { email: string; password: string },
    deviceInfo: DeviceInfo,
  ) {
    const email = String(payload.email ?? '')
      .toLowerCase()
      .trim();
    const password = String(payload.password ?? '');
    if (!email || !password) {
      throw new BadRequestException('Email and password required');
    }

    const result = await pool.query<UserRow>(
      'SELECT id, email, name, password_hash FROM users WHERE email = $1',
      [email],
    );
    if (!result.rowCount) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = result.rows[0];
    if (!user.password_hash) {
      throw new UnauthorizedException('Use Google sign-in for this account');
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueSession(user, deviceInfo);
  }

  async me(token: string) {
    let data: {
      sub: string;
      email: string;
      name?: string | null;
      deviceId?: string;
    };

    try {
      data = jwt.verify(token, this.jwtSecret()) as typeof data;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const deviceId = data.deviceId;
    if (!deviceId) {
      throw new UnauthorizedException('Invalid token');
    }

    const device = await pool.query<{ revoked_at: string | null }>(
      `SELECT revoked_at FROM user_devices WHERE id = $1 AND user_id = $2`,
      [deviceId, data.sub],
    );
    if (!device.rowCount || device.rows[0].revoked_at) {
      throw new UnauthorizedException('Session revoked');
    }

    await pool.query(`UPDATE user_devices SET last_used_at = now() WHERE id = $1`, [
      deviceId,
    ]);

    return {
      id: data.sub,
      email: data.email,
      name: data.name ?? null,
      deviceId,
    };
  }

  async refresh(refreshToken: string) {
    const token = String(refreshToken ?? '').trim();
    if (!token) {
      throw new BadRequestException('Refresh token required');
    }

    const refreshTokenHash = this.hashRefreshToken(token);
    const result = await pool.query<
      UserDeviceRow & { email: string; user_name: string | null }
    >(
      `
      SELECT
        d.id,
        d.user_id,
        d.name,
        d.platform,
        d.user_agent,
        d.ip,
        d.created_at,
        d.last_used_at,
        d.revoked_at,
        u.email,
        u.name AS user_name
      FROM user_devices d
      JOIN users u ON u.id = d.user_id
      WHERE d.refresh_token_hash = $1
      LIMIT 1
      `,
      [refreshTokenHash],
    );

    if (!result.rowCount) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const row = result.rows[0];
    if (row.revoked_at) {
      throw new UnauthorizedException('Session revoked');
    }

    const user: UserRow = {
      id: row.user_id,
      email: row.email,
      name: row.user_name,
      password_hash: null,
    };

    const newRefreshToken = await this.rotateRefreshToken(row.id);
    return {
      token: this.signAccessToken(user, row.id),
      refreshToken: newRefreshToken,
      device: {
        id: row.id,
        user_id: row.user_id,
        name: row.name,
        platform: row.platform,
        user_agent: row.user_agent,
        ip: row.ip,
        created_at: row.created_at,
        last_used_at: new Date().toISOString(),
        revoked_at: row.revoked_at,
      },
      user: this.toUser(user),
    };
  }

  async listDevices(userId: string) {
    const result = await pool.query<UserDeviceRow>(
      `
      SELECT id, user_id, name, platform, user_agent, ip, created_at, last_used_at, revoked_at
      FROM user_devices
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId],
    );
    return result.rows;
  }

  async revokeDevice(userId: string, deviceId: string) {
    const id = String(deviceId ?? '').trim();
    if (!id) {
      throw new BadRequestException('Device id required');
    }

    const result = await pool.query<{ id: string }>(
      `
      UPDATE user_devices
      SET revoked_at = now(), refresh_token_hash = NULL
      WHERE id = $1 AND user_id = $2 AND revoked_at IS NULL
      RETURNING id
      `,
      [id, userId],
    );

    if (!result.rowCount) {
      // idempotent: either not found, not owned, or already revoked
      return { revoked: false };
    }

    return { revoked: true };
  }

  async exchangeGoogleCode(code: string, redirectUri: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID ?? '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
    if (!clientId || !clientSecret) {
      throw new BadRequestException('Google OAuth not configured');
    }

    const params = new URLSearchParams();
    params.set('code', code);
    params.set('client_id', clientId);
    params.set('client_secret', clientSecret);
    params.set('redirect_uri', redirectUri);
    params.set('grant_type', 'authorization_code');

    const resp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new BadRequestException(`Google token exchange failed: ${text}`);
    }

    return (await resp.json()) as { id_token?: string; access_token?: string };
  }

  async getGoogleProfile(idToken: string): Promise<GoogleProfile> {
    const resp = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
        idToken,
      )}`,
    );
    if (!resp.ok) {
      const text = await resp.text();
      throw new BadRequestException(`Google token verify failed: ${text}`);
    }
    const data = (await resp.json()) as {
      email?: string;
      name?: string;
      picture?: string;
    };
    if (!data.email) {
      throw new BadRequestException('Google profile missing email');
    }
    return { email: data.email, name: data.name, picture: data.picture };
  }

  async findOrCreateGoogleUser(profile: GoogleProfile) {
    const email = profile.email.toLowerCase();
    const existing = await pool.query<UserRow>(
      'SELECT id, email, name, password_hash FROM users WHERE email = $1',
      [email],
    );
    if (existing.rowCount) {
      return existing.rows[0];
    }

    const id = randomUUID();
    const name = profile.name ?? null;
    const result = await pool.query<UserRow>(
      'INSERT INTO users (id, email, name, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, name, password_hash',
      [id, email, name, null],
    );
    return result.rows[0];
  }
}
