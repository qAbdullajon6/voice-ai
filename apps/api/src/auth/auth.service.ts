import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { pool } from '../db';

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
};

type GoogleProfile = {
  email: string;
  name?: string;
  picture?: string;
};

@Injectable()
export class AuthService {
  private jwtSecret() {
    return process.env.JWT_SECRET ?? 'change-me';
  }

  private signToken(user: UserRow) {
    return jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      this.jwtSecret(),
      { expiresIn: '7d' },
    );
  }

  issueToken(user: UserRow) {
    return this.signToken(user);
  }

  private toUser(row: UserRow) {
    return { id: row.id, email: row.email, name: row.name };
  }

  async register(payload: { name?: string; email: string; password: string }) {
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
    return { token: this.signToken(user), user: this.toUser(user) };
  }

  async login(payload: { email: string; password: string }) {
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

    return { token: this.signToken(user), user: this.toUser(user) };
  }

  me(token: string) {
    try {
      const data = jwt.verify(token, this.jwtSecret()) as {
        sub: string;
        email: string;
        name?: string | null;
      };
      return { id: data.sub, email: data.email, name: data.name ?? null };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
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
