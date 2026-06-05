'use client';

import { useState } from 'react';
import {
  Box,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
} from '@mui/material';
import NotificationCard from './NotificationCard';
import { Log } from '@/services/logger';

interface Notification {
  ID: string;
  Type: 'Event' | 'Result' | 'Placement';
  Message: string;
  Timestamp: string;
  IsViewed?: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  currentPage: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function NotificationList({
  notifications,
  currentPage,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: NotificationListProps) {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const totalPages = Math.ceil(total / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedNotifications = localNotifications.slice(
    startIndex,
    startIndex + limit
  );

  const handleDelete = (id: string) => {
    setLocalNotifications((prev) =>
      prev.filter((notification) => notification.ID !== id)
    );
  };

  const handleLimitChange = (newLimit: number) => {
    Log('frontend', 'info', 'component', `User changed items per page to: ${newLimit}`);
    onLimitChange(newLimit);
  };

  return (
    <Stack spacing={3}>
      {/* Controls */}
      <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Showing {paginatedNotifications.length} of {total} notifications
          </Typography>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="limit-select-label">Per Page</InputLabel>
            <Select
              labelId="limit-select-label"
              id="limit-select"
              value={limit}
              label="Per Page"
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Notifications List */}
      <Box>
        {paginatedNotifications.length > 0 ? (
          paginatedNotifications.map((notification) => (
            <NotificationCard
              key={notification.ID}
              id={notification.ID}
              type={notification.Type}
              message={notification.Message}
              timestamp={notification.Timestamp}
              isViewed={notification.IsViewed !== false}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No notifications to display
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => {
              Log('frontend', 'info', 'component', `User navigated to page: ${page}`);
              onPageChange(page);
            }}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Stack>
  );
}
