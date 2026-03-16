import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { name?: string; email?: string; password?: string },
  ) {
    return this.authService.register({
      name: body.name,
      email: String(body.email ?? ''),
      password: String(body.password ?? ''),
    });
  }

  @Post('login')
  async login(@Body() body: { email?: string; password?: string }) {
    return this.authService.login({
      email: String(body.email ?? ''),
      password: String(body.password ?? ''),
    });
  }

  @Get('me')
  async me(@Req() req: Request) {
    const auth = req.headers.authorization ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    return this.authService.me(token);
  }

  @Get('google')
  async google(@Query('redirect') redirect: string | undefined, @Res() res: Response) {
    const clientId = process.env.GOOGLE_CLIENT_ID ?? '';
    if (!clientId) {
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }
    const baseUrl = process.env.API_URL ?? 'http://127.0.0.1:4000';
    const redirectUri = `${baseUrl}/auth/google/callback`;
    const webUrl = redirect || process.env.WEB_URL || 'http://localhost:3000';

    const state = Buffer.from(JSON.stringify({ redirect: webUrl })).toString(
      'base64url',
    );

    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid email profile');
    url.searchParams.set('prompt', 'select_account');
    url.searchParams.set('state', state);

    return res.redirect(url.toString());
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Res() res: Response,
  ) {
    let redirectUrl = process.env.WEB_URL || 'http://localhost:3000';
    if (state) {
      try {
        const parsed = JSON.parse(Buffer.from(state, 'base64url').toString());
        if (parsed?.redirect) {
          redirectUrl = String(parsed.redirect);
        }
      } catch {
        // ignore bad state
      }
    }

    if (!code) {
      return res.redirect(`${redirectUrl}/login?error=missing_code`);
    }

    const baseUrl = process.env.API_URL ?? 'http://127.0.0.1:4000';
    const redirectUri = `${baseUrl}/auth/google/callback`;
    const tokens = await this.authService.exchangeGoogleCode(code, redirectUri);
    if (!tokens.id_token) {
      return res.redirect(`${redirectUrl}/login?error=missing_token`);
    }

    const profile = await this.authService.getGoogleProfile(tokens.id_token);
    const user = await this.authService.findOrCreateGoogleUser(profile);
    const finalToken = this.authService.issueToken(user);
    return res.redirect(
      `${redirectUrl}/login?token=${encodeURIComponent(finalToken)}`,
    );
  }
}
