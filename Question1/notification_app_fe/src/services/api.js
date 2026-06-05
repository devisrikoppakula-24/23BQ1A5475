import axios from 'axios';
import { Log } from './logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://4.224.186.213/evaluation-service';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    Log('frontend', 'info', 'api', `Request successful: ${response.config.url}`);
    return response;
  },
  (error) => {
    const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
    Log('frontend', 'error', 'api', `${error.config?.url} failed: ${errorMessage}`);
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      Log('frontend', 'warn', 'auth', 'Unauthorized - token removed');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function fetchNotifications({ limit, page, notification_type, token }) {
  try {
    Log('frontend', 'info', 'api', `Fetching notifications with limit=${limit}, page=${page}`);
    const response = await apiClient.get('/notifications', {
      params: { limit: limit || 20, page: page || 1, ...(notification_type && { notification_type }) },
    });
    const data = response.data.notifications || [];
    Log('frontend', 'info', 'api', `Successfully fetched ${data.length} notifications`);
    return data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch notifications';
    Log('frontend', 'error', 'api', `Fetch notifications failed: ${msg}`);
    throw new Error(msg);
  }
}

export async function markNotificationAsViewed(notificationId) {
  try {
    Log('frontend', 'info', 'api', `Marking notification ${notificationId} as viewed`);
    const response = await apiClient.put(`/notifications/${notificationId}/view`);
    Log('frontend', 'info', 'api', `Successfully marked notification ${notificationId} as viewed`);
    return response.data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to mark as viewed';
    Log('frontend', 'error', 'api', `Mark viewed failed: ${msg}`);
    throw new Error(msg);
  }
}

export async function deleteNotification(notificationId) {
  try {
    Log('frontend', 'info', 'api', `Deleting notification ${notificationId}`);
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    Log('frontend', 'info', 'api', `Successfully deleted notification ${notificationId}`);
    return response.data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to delete notification';
    Log('frontend', 'error', 'api', `Delete failed: ${msg}`);
    throw new Error(msg);
  }
}

export async function getNotificationStats() {
  try {
    Log('frontend', 'info', 'api', 'Fetching notification statistics');
    const response = await apiClient.get('/notifications/stats');
    Log('frontend', 'info', 'api', 'Successfully fetched notification statistics');
    return response.data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch stats';
    Log('frontend', 'error', 'api', `Fetch stats failed: ${msg}`);
    throw new Error(msg);
  }
}

export default apiClient;
