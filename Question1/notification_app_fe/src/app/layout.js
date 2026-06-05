'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Notification Management System</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
