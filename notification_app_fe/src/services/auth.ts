import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://20.244.56.144/evaluation-service';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

/**
 * Authenticate user and get access token
 */
export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      {
        email: credentials.email,
        password: credentials.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data as AuthResponse;

    // Store token in localStorage
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('token_type', data.token_type);
    localStorage.setItem('expires_in', data.expires_in.toString());

    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed. Please check your credentials.');
  }
}

/**
 * Logout user and clear stored credentials
 */
export function logout(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('expires_in');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<AuthResponse> {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      { refresh_token: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data as AuthResponse;

    localStorage.setItem('access_token', data.access_token);

    return data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    throw new Error('Session expired. Please login again.');
  }
}
