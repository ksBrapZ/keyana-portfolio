// pages/index.tsx
import Head from 'next/head';
import { NextPage } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FocusSection from '@/components/FocusSection';
import PastSection from '@/components/PastSection';
import BioSection from '@/components/BioSection';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-light">
      <Head>
        <title>Keyana Sapp | Digital and Analogue Builder</title>
        <meta name="description" content="Personal website of Keyana Sapp" />
        
        {/* Favicon configuration */}
        <link rel="icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600&family=Geist+Mono:wght@300;400&display=swap" rel="stylesheet" />
      </Head>

      <Header />

      <main className="py-3 flex-1">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg">
          {/* Two-column layout for larger screens */}
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <div className="space-y-3">
              <FocusSection />
              <PastSection />
            </div>
            <div>
              <BioSection />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;