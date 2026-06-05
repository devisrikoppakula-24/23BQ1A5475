'use client';

import { useMemo } from 'react';
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Stack,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';

interface FilterPanelProps {
  selectedTypes: string[];
  onFilterChange: (types: string[]) => void;
}

const NOTIFICATION_TYPES = [
  { label: 'Events', value: 'Event', icon: EventIcon },
  { label: 'Results', value: 'Result', icon: EmojiEventsIcon },
  { label: 'Placements', value: 'Placement', icon: WorkIcon },
];

export default function FilterPanel({ selectedTypes, onFilterChange }: FilterPanelProps) {
  const handleChange = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    onFilterChange(newSelectedTypes);
  };

  const allSelected = selectedTypes.length === NOTIFICATION_TYPES.length;
  const someSelected = selectedTypes.length > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      onFilterChange([]);
    } else {
      onFilterChange(NOTIFICATION_TYPES.map((t) => t.value));
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Filter Notifications
      </Typography>

      <Stack spacing={1.5}>
        {/* Select All Option */}
        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={handleSelectAll}
            />
          }
          label={
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Select All
            </Typography>
          }
        />

        {/* Individual Type Filters */}
        <FormGroup>
          {NOTIFICATION_TYPES.map(({ label, value }) => (
            <FormControlLabel
              key={value}
              control={
                <Checkbox
                  checked={selectedTypes.includes(value)}
                  onChange={() => handleChange(value)}
                />
              }
              label={
                <Typography variant="body2">
                  {label}
                </Typography>
              }
              sx={{ ml: 2 }}
            />
          ))}
        </FormGroup>
      </Stack>

      {/* Filter Summary */}
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ display: 'block', mt: 2 }}
      >
        Showing: {selectedTypes.length > 0 ? selectedTypes.join(', ') : 'No filters applied'}
      </Typography>
    </Box>
  );
}
