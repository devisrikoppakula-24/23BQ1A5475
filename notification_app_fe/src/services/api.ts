import axios, { AxiosInstance } from 'axios';
import { Log, LogHelpers } from './logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://20.244.56.144/evaluation-service';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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
  (response) => {
    Log('frontend', 'info', 'api', `Request successful: ${response.config.url}`);
    return response;
  },
  (error) => {
    const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
    Log('frontend', 'error', 'api', `${error.config.url} failed: ${errorMessage}`);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      Log('frontend', 'warn', 'auth', 'Unauthorized access - token removed, redirecting to login');
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
    Log('frontend', 'info', 'api', `Fetching notifications with limit=${params.limit}, page=${params.page}`);
    
    const response = await apiClient.get('/notifications', {
      params: {
        limit: params.limit || 20,
        page: params.page || 1,
        ...(params.notification_type && { notification_type: params.notification_type }),
      },
    });
    
    const data = response.data.notifications || [];
    Log('frontend', 'info', 'api', `Successfully fetched ${data.length} notifications`);
    
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
    Log('frontend', 'error', 'api', `Fetch notifications failed: ${errorMessage}`);
    throw new Error(errorMessage);
  }
}

/**
 * Mark notification as viewed
 */
export async function markNotificationAsViewed(notificationId: string) {
  try {
    Log('frontend', 'info', 'api', `Marking notification ${notificationId} as viewed`);
    
    const response = await apiClient.put(`/notifications/${notificationId}/view`);
    
    Log('frontend', 'info', 'api', `Successfully marked notification ${notificationId} as viewed`);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as viewed';
    Log('frontend', 'error', 'api', `Mark notification viewed failed: ${errorMessage}`);
    throw new Error(errorMessage);
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  try {
    Log('frontend', 'info', 'api', `Deleting notification ${notificationId}`);
    
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    
    Log('frontend', 'info', 'api', `Successfully deleted notification ${notificationId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete notification';
    Log('frontend', 'error', 'api', `Delete notification failed: ${errorMessage}`);
    throw new Error(errorMessage);
  }
}

/**
 * Get notification statistics
 */
export async function getNotificationStats() {
  try {
    Log('frontend', 'info', 'api', 'Fetching notification statistics');
    
    const response = await apiClient.get('/notifications/stats');
    
    Log('frontend', 'info', 'api', 'Successfully fetched notification statistics');
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notification stats';
    Log('frontend', 'error', 'api', `Fetch notification stats failed: ${errorMessage}`);
    throw new Error(errorMessage);
  }
}

export default apiClient;
