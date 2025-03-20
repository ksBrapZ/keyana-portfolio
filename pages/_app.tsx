// pages/_app.tsx
import '../styles/globals.css';
import '../styles/prism-theme.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ThemeProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="keyana-theme">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;