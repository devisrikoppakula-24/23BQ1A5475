'use client';

import { Box, FormGroup, FormControlLabel, Checkbox, Typography, Stack } from '@mui/material';
import { Log } from '@/services/logger';

const NOTIFICATION_TYPES = [
  { label: 'Events', value: 'Event' },
  { label: 'Results', value: 'Result' },
  { label: 'Placements', value: 'Placement' },
];

export default function FilterPanel({ selectedTypes, onFilterChange }) {
  const allSelected = selectedTypes.length === NOTIFICATION_TYPES.length;
  const someSelected = selectedTypes.length > 0 && !allSelected;

  const handleChange = (type) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    Log('frontend', 'debug', 'component', `Filter toggled: ${type}`);
    onFilterChange(newTypes);
  };

  const handleSelectAll = () => {
    Log('frontend', 'debug', 'component', allSelected ? 'Deselected all filters' : 'Selected all filters');
    onFilterChange(allSelected ? [] : NOTIFICATION_TYPES.map((t) => t.value));
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Filter Notifications</Typography>
      <Stack spacing={1.5}>
        <FormControlLabel
          control={<Checkbox checked={allSelected} indeterminate={someSelected} onChange={handleSelectAll} />}
          label={<Typography variant="body1" sx={{ fontWeight: 500 }}>Select All</Typography>}
        />
        <FormGroup>
          {NOTIFICATION_TYPES.map(({ label, value }) => (
            <FormControlLabel
              key={value}
              control={<Checkbox checked={selectedTypes.includes(value)} onChange={() => handleChange(value)} />}
              label={<Typography variant="body2">{label}</Typography>}
              sx={{ ml: 2 }}
            />
          ))}
        </FormGroup>
      </Stack>
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
        Showing: {selectedTypes.length > 0 ? selectedTypes.join(', ') : 'No filters applied'}
      </Typography>
    </Box>
  );
}
