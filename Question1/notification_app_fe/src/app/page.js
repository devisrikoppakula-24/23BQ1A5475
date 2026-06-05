'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Box, CircularProgress, Alert, AppBar, Toolbar,
  Typography, Stack, Paper, Button,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterPanel from '@/components/FilterPanel';
import NotificationList from '@/components/NotificationList';
import { fetchNotifications } from '@/services/api';
import { logout } from '@/services/auth';
import { Log } from '@/services/logger';

export default function Home() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState(['Event', 'Result', 'Placement']);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientID', process.env.NEXT_PUBLIC_CLIENT_ID || '');
      const token = localStorage.getItem('access_token');
      if (!token) {
        Log('frontend', 'warn', 'component', 'No access token - redirecting to login');
        router.push('/login');
        return;
      }
    }

    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        Log('frontend', 'debug', 'component', 'Home page mounted - initiating notification fetch');
        const data = await fetchNotifications({ limit, page: currentPage });
        setNotifications(data || []);
        filterNotifications(data || [], selectedTypes);
        Log('frontend', 'info', 'component', `Successfully loaded ${data?.length || 0} notifications`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        Log('frontend', 'error', 'component', `Failed to load notifications: ${msg}`);
        setError(msg);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [currentPage, limit]);

  const filterNotifications = (data, types) => {
    setFilteredNotifications(types.length === 0 ? data : data.filter((n) => types.includes(n.Type)));
    setCurrentPage(1);
  };

  const handleFilterChange = (types) => {
    Log('frontend', 'info', 'component', `User changed filters to: ${types.join(', ')}`);
    setSelectedTypes(types);
    filterNotifications(notifications, types);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <NotificationsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Notification Management System</Typography>
          <Typography variant="caption" sx={{ mr: 2 }}>{filteredNotifications.length} notifications</Typography>
          <Button color="inherit" size="small" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

          <Paper elevation={1} sx={{ p: 2 }}>
            <FilterPanel selectedTypes={selectedTypes} onFilterChange={handleFilterChange} />
          </Paper>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredNotifications.length === 0 ? (
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary" variant="h6">No notifications found</Typography>
              <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                Try adjusting your filters or check back later
              </Typography>
            </Paper>
          ) : (
            <NotificationList
              notifications={filteredNotifications}
              currentPage={currentPage}
              limit={limit}
              total={filteredNotifications.length}
              onPageChange={setCurrentPage}
              onLimitChange={(newLimit) => { setLimit(newLimit); setCurrentPage(1); }}
            />
          )}
        </Stack>
      </Container>
    </>
  );
}
