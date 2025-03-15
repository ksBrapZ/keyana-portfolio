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
        <link rel="icon" href="/favicon.ico" />
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