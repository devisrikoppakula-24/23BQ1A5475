import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://20.244.56.144/evaluation-service';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface FetchNotificationsParams {
  limit?: number;
  page?: number;
  notification_type?: string;
  token?: string | null;
}

/**
 * Fetch notifications from the API
 */
export async function fetchNotifications(params: FetchNotificationsParams) {
  try {
    const response = await apiClient.get('/notifications', {
      params: {
        limit: params.limit || 20,
        page: params.page || 1,
        ...(params.notification_type && { notification_type: params.notification_type }),
      },
    });
    return response.data.notifications || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications');
  }
}

/**
 * Mark notification as viewed
 */
export async function markNotificationAsViewed(notificationId: string) {
  try {
    const response = await apiClient.put(`/notifications/${notificationId}/view`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as viewed:', error);
    throw new Error('Failed to mark notification as viewed');
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  try {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw new Error('Failed to delete notification');
  }
}

/**
 * Get notification statistics
 */
export async function getNotificationStats() {
  try {
    const response = await apiClient.get('/notifications/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    throw new Error('Failed to fetch notification stats');
  }
}

export default apiClient;
