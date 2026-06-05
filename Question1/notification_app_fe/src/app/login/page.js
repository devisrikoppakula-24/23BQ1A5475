'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Button, TextField, Typography, Paper, CircularProgress, Alert, Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Log } from '@/services/logger';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://4.224.186.213/evaluation-service';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    name: '',
    rollNo: '',
    accessCode: '',
    client_secret: '',
  });
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      Log('frontend', 'info', 'auth', `Login attempt for: ${form.email}`);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: form.email,
        name: form.name,
        rollNo: form.rollNo,
        accessCode: form.accessCode,
        clientID: process.env.NEXT_PUBLIC_CLIENT_ID || '',
        clientSecret: form.client_secret,
      }, { headers: { 'Content-Type': 'application/json' } });

      const data = response.data;
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('clientID', process.env.NEXT_PUBLIC_CLIENT_ID || '');
      Log('frontend', 'info', 'auth', 'Login successful');
      router.push('/');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Login failed';
      Log('frontend', 'error', 'auth', `Login failed: ${msg}`);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenLogin = (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    localStorage.setItem('access_token', token.trim());
    localStorage.setItem('clientID', process.env.NEXT_PUBLIC_CLIENT_ID || '');
    Log('frontend', 'info', 'auth', 'Logged in via direct token');
    router.push('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <NotificationsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={600}>Notification System</Typography>
          <Typography variant="body2" color="textSecondary">Sign in to continue</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" name="email" type="email"
            value={form.email} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Name" name="name"
            value={form.name} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Roll No" name="rollNo"
            value={form.rollNo} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Access Code" name="accessCode"
            value={form.accessCode} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Client Secret" name="client_secret" type="password"
            value={form.client_secret} onChange={handleChange} required sx={{ mb: 3 }} />
          <Button fullWidth variant="contained" type="submit" disabled={loading} size="large">
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Box component="form" onSubmit={handleTokenLogin}>
          <TextField
            fullWidth label="Paste Access Token directly" multiline rows={3}
            value={token} onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGci..." sx={{ mb: 2 }}
          />
          <Button fullWidth variant="outlined" type="submit" size="large">
            Use Token
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
