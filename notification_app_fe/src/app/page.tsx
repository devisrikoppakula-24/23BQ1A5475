'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FilterPanel from '@/components/FilterPanel';
import NotificationList from '@/components/NotificationList';
import { fetchNotifications } from '@/services/api';
import { Log } from '@/services/logger';

interface Notification {
  ID: string;
  Type: 'Event' | 'Result' | 'Placement';
  Message: string;
  Timestamp: string;
  IsViewed?: boolean;
}

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Event', 'Result', 'Placement']);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch notifications on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        Log('frontend', 'debug', 'component', 'Home page mounted - initiating notification fetch');
        
        // Get token from localStorage
        const token = localStorage.getItem('access_token');
        if (!token) {
          Log('frontend', 'warn', 'component', 'No access token found in localStorage');
        }
        
        const notificationTypes = selectedTypes.length > 0 ? selectedTypes : undefined;
        
        const data = await fetchNotifications({
          limit,
          page: currentPage,
          notification_type: notificationTypes?.[0],
          token,
        });

        setNotifications(data || []);
        filterNotifications(data || [], selectedTypes);
        Log('frontend', 'info', 'component', `Successfully loaded ${data?.length || 0} notifications`);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        Log('frontend', 'error', 'component', `Failed to load notifications: ${errorMsg}`);
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [currentPage, limit]);

  // Filter notifications based on selected types
  const filterNotifications = (data: Notification[], types: string[]) => {
    if (types.length === 0) {
      setFilteredNotifications(data);
    } else {
      setFilteredNotifications(
        data.filter((notification) => types.includes(notification.Type))
      );
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleFilterChange = (types: string[]) => {
    Log('frontend', 'info', 'component', `User changed notification filters to: ${types.join(', ')}`);
    setSelectedTypes(types);
    filterNotifications(notifications, types);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  return (
    <>
      {/* App Bar */}
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <NotificationsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Notification Management System
          </Typography>
          <Typography variant="caption">
            {filteredNotifications.length} notifications
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Filter Panel */}
          <Paper elevation={1} sx={{ p: 2 }}>
            <FilterPanel
              selectedTypes={selectedTypes}
              onFilterChange={handleFilterChange}
            />
          </Paper>

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredNotifications.length === 0 ? (
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary" variant="h6">
                No notifications found
              </Typography>
              <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                Try adjusting your filters or check back later
              </Typography>
            </Paper>
          ) : (
            <>
              {/* Notification List */}
              <NotificationList
                notifications={filteredNotifications}
                currentPage={currentPage}
                limit={limit}
                total={filteredNotifications.length}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </>
          )}
        </Stack>
      </Container>
    </>
  );
}
