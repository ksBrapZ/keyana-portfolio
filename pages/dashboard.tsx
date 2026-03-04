import Head from 'next/head';
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://portfolio-dashboard-keyanas-projects.vercel.app';
const PASSWORD_HASH = '0a6d6a3c75e0b92e95cd9cac043f3471dca4c7e9d875de19bf835567f1b6496d';

const DashboardPage: NextPage = () => {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('dashboard-unlocked') === 'true') {
      setUnlocked(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === PASSWORD_HASH) {
      setUnlocked(true);
      setError(false);
      sessionStorage.setItem('dashboard-unlocked', 'true');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Dashboard | Keyana Sapp</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Header />

      <main className="flex-1 flex flex-col">
        {!unlocked ? (
          <div className="flex-1 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-sm px-6">
              <label className="block text-sm text-muted-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md
                           text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              {error && (
                <p className="text-destructive text-sm mt-2">Incorrect password</p>
              )}
              <button
                type="submit"
                className="mt-4 w-full px-4 py-2 bg-foreground text-background
                           rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
              >
                Enter
              </button>
            </form>
          </div>
        ) : (
          <iframe
            src={DASHBOARD_URL}
            className="flex-1 w-full border-0"
            title="Portfolio Dashboard"
          />
        )}
      </main>

      {!unlocked && <Footer />}
    </div>
  );
};

export default DashboardPage;
