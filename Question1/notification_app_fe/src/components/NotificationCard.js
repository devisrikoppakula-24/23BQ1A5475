'use client';

import { Card, CardContent, Typography, Chip, Box, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';
import { deleteNotification } from '@/services/api';
import { Log } from '@/services/logger';

const TYPE_CONFIG = {
  Event:     { color: 'info',    icon: EventIcon,       label: 'Event' },
  Result:    { color: 'success', icon: EmojiEventsIcon, label: 'Result' },
  Placement: { color: 'warning', icon: WorkIcon,        label: 'Placement' },
};

export default function NotificationCard({ id, type, message, timestamp, isViewed = true, onDelete }) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  const handleDelete = async () => {
    try {
      Log('frontend', 'info', 'component', `Deleting notification: ${id}`);
      await deleteNotification(id);
      Log('frontend', 'info', 'component', `Successfully deleted notification: ${id}`);
      onDelete?.(id);
    } catch (error) {
      Log('frontend', 'error', 'component', `Failed to delete notification ${id}: ${error}`);
    }
  };

  const formatTimestamp = (ts) => {
    try {
      return new Date(ts).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch { return ts; }
  };

  return (
    <Card sx={{
      mb: 2,
      borderLeft: isViewed ? 'none' : '4px solid #1976d2',
      '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Icon sx={{ fontSize: 20, color: `${config.color}.main` }} />
              <Chip label={config.label} size="small" color={config.color} variant="outlined" />
              {!isViewed && <Chip label="New" size="small" color="primary" />}
            </Box>
            <Typography variant="body1" sx={{ fontWeight: isViewed ? 400 : 600, mb: 1 }}>{message}</Typography>
            <Typography variant="caption" color="textSecondary">{formatTimestamp(timestamp)}</Typography>
          </Box>
          <Tooltip title="Delete notification">
            <IconButton size="small" onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
