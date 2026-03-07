'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'shop_owner' | 'admin';
  avatar?: { url: string };
  phone?: string;
}

interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// ─── Login ───────────────────────────────────────────────────────────────────

function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(email: string, password: string, redirectTo = '/') {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      if (res.data) {
        const { user, tokens } = res.data;
        setAuth(user, tokens.accessToken, tokens.refreshToken);
        router.push(redirectTo);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }

  return { mutate, isLoading, error };
}

// ─── Register ─────────────────────────────────────────────────────────────────

function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(
    email: string,
    password: string,
    name: string,
    phone?: string,
    redirectTo = '/',
  ) {
    setIsLoading(true);
    setError(null);
    try {
      const body: Record<string, string> = { email, password, name };
      if (phone) body.phone = phone;
      const res = await api.post<AuthResponse>('/auth/register', body);
      if (res.data) {
        const { user, tokens } = res.data;
        setAuth(user, tokens.accessToken, tokens.refreshToken);
        router.push(redirectTo);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }

  return { mutate, isLoading, error };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

function useLogout() {
  const { logout: clearAuth } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function mutate() {
    setIsLoading(true);
    const refreshToken = useAuthStore.getState().refreshToken;
    if (refreshToken) {
      try {
        await api.post('/auth/logout', { refreshToken });
      } catch {
        // Proceed with local logout even if server call fails
      }
    }
    clearAuth();
    setIsLoading(false);
    router.push('/login');
  }

  return { mutate, isLoading, error: null };
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Returns true on success, false on error. Page manages success state. */
  async function mutate(email: string): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      await api.post<{ message: string }>('/auth/forgot-password', { email });
      return true;
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Gửi email thất bại. Vui lòng thử lại.',
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { mutate, isLoading, error };
}

// ─── Reset Password ───────────────────────────────────────────────────────────

function useResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(token: string, password: string) {
    setIsLoading(true);
    setError(null);
    try {
      await api.post<{ message: string }>('/auth/reset-password', { token, password });
      router.push('/login');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { mutate, isLoading, error };
}

// ─── Public Hook ──────────────────────────────────────────────────────────────

export function useAuth() {
  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();
  const forgotPassword = useForgotPassword();
  const resetPassword = useResetPassword();

  return { login, register, logout, forgotPassword, resetPassword };
}
