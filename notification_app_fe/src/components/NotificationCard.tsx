'use client';

import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';
import { deleteNotification } from '@/services/api';
import { Log } from '@/services/logger';

interface NotificationCardProps {
  id: string;
  type: 'Event' | 'Result' | 'Placement';
  message: string;
  timestamp: string;
  isViewed?: boolean;
  onDelete?: (id: string) => void;
}

const TYPE_CONFIG = {
  Event: {
    color: 'info',
    icon: EventIcon,
    label: 'Event',
  },
  Result: {
    color: 'success',
    icon: EmojiEventsIcon,
    label: 'Result',
  },
  Placement: {
    color: 'warning',
    icon: WorkIcon,
    label: 'Placement',
  },
};

export default function NotificationCard({
  id,
  type,
  message,
  timestamp,
  isViewed = true,
  onDelete,
}: NotificationCardProps) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  const handleDelete = async () => {
    try {
      Log('frontend', 'info', 'component', `User deleting notification: ${id} (${type}: ${message.substring(0, 30)}...)`);
      await deleteNotification(id);
      Log('frontend', 'info', 'component', `Successfully deleted notification: ${id}`);
      onDelete?.(id);
    } catch (error) {
      Log('frontend', 'error', 'component', `Failed to delete notification ${id}: ${error}`);
      console.error('Failed to delete notification:', error);
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        opacity: isViewed ? 1 : 0.95,
        borderLeft: isViewed ? 'none' : '4px solid #1976d2',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            {/* Header with Type and Badge */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
              }}
            >
              <Icon sx={{ fontSize: 20, color: `${config.color}.main` }} />
              <Chip
                label={config.label}
                size="small"
                color={config.color as any}
                variant="outlined"
              />
              {!isViewed && (
                <Chip
                  label="New"
                  size="small"
                  color="primary"
                  variant="filled"
                />
              )}
            </Box>

            {/* Message */}
            <Typography
              variant="body1"
              sx={{
                fontWeight: isViewed ? 400 : 600,
                mb: 1,
                wordBreak: 'break-word',
              }}
            >
              {message}
            </Typography>

            {/* Timestamp */}
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ display: 'block' }}
            >
              {formatTimestamp(timestamp)}
            </Typography>
          </Box>

          {/* Delete Button */}
          <Tooltip title="Delete notification">
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.dark',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
