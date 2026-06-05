'use client';

import { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Notification Management System</title>
        <meta name="description" content="Manage and view all notifications in one place" />
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
