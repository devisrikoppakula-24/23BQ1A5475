import axios from 'axios';
import { Log } from './logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://4.224.186.213/evaluation-service';

export async function login(credentials) {
  try {
    Log('frontend', 'info', 'auth', `Attempting login for user: ${credentials.email}`);
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: credentials.email,
      name: credentials.name || '',
      rollNo: credentials.rollNo || '',
      accessCode: credentials.accessCode || '',
      clientID: process.env.NEXT_PUBLIC_CLIENT_ID || '',
      clientSecret: credentials.client_secret,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = response.data;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('token_type', data.token_type || 'Bearer');
    localStorage.setItem('clientID', process.env.NEXT_PUBLIC_CLIENT_ID || '');
    Log('frontend', 'info', 'auth', `Login successful for user: ${credentials.email}`);
    return data;
  } catch (error) {
    const msg = error?.response?.data?.message || error.message || 'Login failed';
    Log('frontend', 'error', 'auth', `Login failed: ${msg}`);
    throw new Error(msg);
  }
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('clientID');
  Log('frontend', 'info', 'auth', 'User logged out successfully');
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}
