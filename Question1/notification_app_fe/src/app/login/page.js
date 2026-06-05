'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Button, TextField, Typography, Paper, CircularProgress, Alert,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { login } from '@/services/auth';
import { Log } from '@/services/logger';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    name: '',
    rollNo: '',
    accessCode: '',
    client_secret: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      Log('frontend', 'info', 'auth', `Login attempt for: ${form.email}`);
      await login(form);
      Log('frontend', 'info', 'auth', 'Login successful, redirecting to home');
      router.push('/');
    } catch (err) {
      setError(err.message);
      Log('frontend', 'error', 'auth', `Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
      </Paper>
    </Box>
  );
}
