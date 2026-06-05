import Providers from './providers';
import './globals.css';

export const metadata = {
  title: 'Notification Management System',
  description: 'Manage your notifications',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
