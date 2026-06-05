'use client';

import { useState } from 'react';
import {
  Box, Pagination, Stack, FormControl, InputLabel,
  Select, MenuItem, Typography, Paper,
} from '@mui/material';
import NotificationCard from './NotificationCard';
import { Log } from '@/services/logger';

export default function NotificationList({ notifications, currentPage, limit, total, onPageChange, onLimitChange }) {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const totalPages = Math.ceil(total / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedNotifications = localNotifications.slice(startIndex, startIndex + limit);

  const handleDelete = (id) => setLocalNotifications((prev) => prev.filter((n) => n.ID !== id));

  const handleLimitChange = (newLimit) => {
    Log('frontend', 'info', 'component', `User changed items per page to: ${newLimit}`);
    onLimitChange(newLimit);
  };

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="textSecondary">
            Showing {paginatedNotifications.length} of {total} notifications
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Per Page</InputLabel>
            <Select value={limit} label="Per Page" onChange={(e) => handleLimitChange(Number(e.target.value))}>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Box>
        {paginatedNotifications.length > 0 ? (
          paginatedNotifications.map((n) => (
            <NotificationCard
              key={n.ID} id={n.ID} type={n.Type} message={n.Message}
              timestamp={n.Timestamp} isViewed={n.IsViewed !== false} onDelete={handleDelete}
            />
          ))
        ) : (
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">No notifications to display</Typography>
          </Paper>
        )}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Pagination
            count={totalPages} page={currentPage} color="primary" size="large"
            showFirstButton showLastButton
            onChange={(_, page) => {
              Log('frontend', 'info', 'component', `User navigated to page: ${page}`);
              onPageChange(page);
            }}
          />
        </Box>
      )}
    </Stack>
  );
}
