require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const API_BASE_URL = process.env.API_BASE_URL || 'http://4.224.186.213/evaluation-service';

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    Log('backend', 'info', 'middleware', `${req.method} ${req.path} ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

async function Log(stack, level, packageName, message) {
  const token = process.env.ACCESS_TOKEN;
  try {
    await axios.post(`${API_BASE_URL}/logs`, {
      stack, level, package: packageName, message,
      timestamp: new Date().toISOString(),
    }, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  } catch {
    console.debug('[Logger] Could not send log to server');
  }
  console.log(`[${stack.toUpperCase()}] [${level.toUpperCase()}] ${packageName}: ${message}`);
}

app.post('/auth/login', async (req, res) => {
  try {
    await Log('backend', 'info', 'auth', `Login attempt: ${req.body.email}`);
    const response = await axios.post(`${API_BASE_URL}/auth/login`, req.body);
    await Log('backend', 'info', 'auth', 'Login successful');
    res.json(response.data);
  } catch (error) {
    await Log('backend', 'error', 'auth', `Login failed: ${error.message}`);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/notifications', async (req, res) => {
  try {
    const token = req.headers.authorization;
    await Log('backend', 'info', 'handler', `Fetching notifications: ${JSON.stringify(req.query)}`);
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      params: req.query,
      headers: { ...(token && { Authorization: token }) },
    });
    await Log('backend', 'info', 'handler', `Fetched ${response.data.notifications?.length || 0} notifications`);
    res.json(response.data);
  } catch (error) {
    await Log('backend', 'error', 'handler', `Fetch notifications failed: ${error.message}`);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.delete('/notifications/:id', async (req, res) => {
  try {
    const token = req.headers.authorization;
    await Log('backend', 'info', 'handler', `Deleting notification: ${req.params.id}`);
    const response = await axios.delete(`${API_BASE_URL}/notifications/${req.params.id}`, {
      headers: { ...(token && { Authorization: token }) },
    });
    await Log('backend', 'info', 'handler', `Deleted notification: ${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    await Log('backend', 'error', 'handler', `Delete failed: ${error.message}`);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.put('/notifications/:id/view', async (req, res) => {
  try {
    const token = req.headers.authorization;
    await Log('backend', 'info', 'handler', `Marking notification viewed: ${req.params.id}`);
    const response = await axios.put(`${API_BASE_URL}/notifications/${req.params.id}/view`, {}, {
      headers: { ...(token && { Authorization: token }) },
    });
    res.json(response.data);
  } catch (error) {
    await Log('backend', 'error', 'handler', `Mark viewed failed: ${error.message}`);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  Log('backend', 'info', 'server', `Backend server started on port ${PORT}`);
  console.log(`Backend running on http://localhost:${PORT}`);
});
