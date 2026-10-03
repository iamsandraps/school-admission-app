import { AuthResponse, User } from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const TOKEN_KEY = 'school_admission_token';
const USER_KEY = 'school_admission_user';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const removeStoredUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
};

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new Error(
      `Cannot connect to backend server at ${API_BASE_URL}. Please ensure the NestJS backend is running.`,
    );
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      `Invalid server response from ${API_BASE_URL}. Please verify NestJS backend port and URL configuration.`,
    );
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'An error occurred';
    throw new Error(errorMsg);
  }

  return data as T;
}
