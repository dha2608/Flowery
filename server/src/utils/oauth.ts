import { env } from '../config/env.js';

// ─── Google OAuth ─────────────────────────────────────────────────────────────

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

export function getGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID || '',
    redirect_uri: env.GOOGLE_CALLBACK_URL || '',
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function getGoogleTokens(code: string): Promise<GoogleTokenResponse> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID || '',
      client_secret: env.GOOGLE_CLIENT_SECRET || '',
      redirect_uri: env.GOOGLE_CALLBACK_URL || '',
      grant_type: 'authorization_code',
    }),
  });
  if (!response.ok) throw new Error('Failed to exchange code for tokens');
  return response.json() as Promise<GoogleTokenResponse>;
}

export async function getGoogleUser(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to get user info');
  return response.json() as Promise<GoogleUserInfo>;
}

// ─── Facebook OAuth ───────────────────────────────────────────────────────────

interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface FacebookUserInfo {
  id: string;
  email?: string;
  name: string;
  picture?: {
    data: {
      url: string;
      width: number;
      height: number;
    };
  };
  first_name?: string;
  last_name?: string;
}

export function getFacebookAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: env.FACEBOOK_APP_ID || '',
    redirect_uri: env.FACEBOOK_CALLBACK_URL || '',
    response_type: 'code',
    scope: 'email,public_profile',
    state: crypto.randomUUID(),
  });
  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
}

export async function getFacebookTokens(code: string): Promise<FacebookTokenResponse> {
  const params = new URLSearchParams({
    client_id: env.FACEBOOK_APP_ID || '',
    client_secret: env.FACEBOOK_APP_SECRET || '',
    redirect_uri: env.FACEBOOK_CALLBACK_URL || '',
    code,
  });

  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`
  );
  if (!response.ok) throw new Error('Failed to exchange code for Facebook tokens');
  return response.json() as Promise<FacebookTokenResponse>;
}

export async function getFacebookUser(accessToken: string): Promise<FacebookUserInfo> {
  const fields = 'id,email,name,picture.type(large),first_name,last_name';
  const response = await fetch(
    `https://graph.facebook.com/v18.0/me?fields=${fields}&access_token=${accessToken}`
  );
  if (!response.ok) throw new Error('Failed to get Facebook user info');
  return response.json() as Promise<FacebookUserInfo>;
}
