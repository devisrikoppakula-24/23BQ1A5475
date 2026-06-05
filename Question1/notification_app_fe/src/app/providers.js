'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';

export default function Providers({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
