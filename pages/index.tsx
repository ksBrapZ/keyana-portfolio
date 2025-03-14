// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Update time based on MST timezone
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Denver'
      };
      setCurrentTime(new Date().toLocaleTimeString('en-US', options) + ' MST');
    };

    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen bg-black text-white font-light flex flex-col overflow-hidden">
      <Head>
        <title>Keyana Sapp | Digital and Analogue Builder</title>
        <meta name="description" content="Personal website of Keyana Sapp" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600&family=Geist+Mono:wght@300;400&display=swap" rel="stylesheet" />
      </Head>

      {/* Header Section with Name and Navigation */}
      <header className="border-b border-gray-800 pt-6 pb-4">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-screen-lg flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Keyana's Info */}
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Keyana Sapp</h1>
            <p className="text-gray-400">Digital and analogue builder</p>
            <p className="text-gray-500 text-sm">Boulder, CO · {currentTime}</p>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link href="/writing" className="text-gray-400 hover:text-white transition duration-300 text-sm uppercase tracking-wider">
                  Writing
                </Link>
              </li>
              <li>
                <Link href="/photos" className="text-gray-400 hover:text-white transition duration-300 text-sm uppercase tracking-wider">
                  Photos
                </Link>
              </li>
              <li>
                <Link href="/toolkit" className="text-gray-400 hover:text-white transition duration-300 text-sm uppercase tracking-wider">
                  Toolkit
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="py-6 flex-1 overflow-auto flex items-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-screen-lg flex justify-center">
          {/* Two-column layout for larger screens */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div>
              {/* Focus Section */}
              <section className="mb-6">
                <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Focus</h2>
                <div>
                  <h3 className="text-lg font-medium group">
                    Co-Founder & CEO, <a href="https://getindigo.ai" className="text-white group-hover:text-gray-300 transition duration-300"><i>Indigo</i></a>
                  </h3>
                  <p className="text-gray-300 italic text-sm">The ultimate AI productivity suite for cracked teams.</p>
                  <p className="text-gray-400 text-sm">All-in-one platform for startups to build commands, assistants and agents on top of their existing data.</p>
                </div>
              </section>

              {/* Past Section */}
              <section>
                <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Past</h2>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-medium group">
                      Co-Founder, <a href="https://www.shopswap.com" className="text-white group-hover:text-gray-300 transition duration-300"><i>ShopSwap</i></a>
                    </h3>
                    <p className="text-gray-400 text-sm">Collaborative growth network for DTC brands. 600+ brands in the network.</p>
                  </div>

                  <div>
                    <h3 className="text-base font-medium group">
                      Partnership Lead, <a href="https://www.appsumo.com" className="text-white group-hover:text-gray-300 transition duration-300"><i>AppSumo</i></a>
                    </h3>
                    <p className="text-gray-400 text-sm">Groupon for software. Launched 50+ apps to network of 1.5M entrepreneurs</p>
                  </div>

                  <div>
                    <h3 className="text-base font-medium group">
                      Event Lead, <a href="https://www.openroomevents.com" className="text-white group-hover:text-gray-300 transition duration-300"><i>OpenRoom</i></a>
                    </h3>
                    <p className="text-gray-400 text-sm">B2B Forums for Dentists, Vets and Pharmacists. Launched APAC region's 1st veterinary trade show</p>
                  </div>

                  <div>
                    <h3 className="text-base font-medium">PhD dropout, <i>Philosophy</i></h3>
                    <p className="text-gray-400 text-sm">Funding fell through before my 1st year. Entered the workforce instead. Thank god.</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Bio Section in second column */}
            <section>
              <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Bio</h2>
              <div className="text-gray-200 text-sm leading-relaxed space-y-4">
                <p>
                  My life has always been guided by curiosity - a drive to explore how things work, why they matter, and how they can be improved. 
                  <br />
                  <br />
                  Raised between cultures, by an Iranian mother and American father, I've learned that meaningful connections often come from blending perspectives.
                </p>
                <p>
                  Whether it's building startups that help small businesses harness AI, tuning my Suzuki DR650, or seeking clarity in mountain adventures, <em>I'm fascinated by the interplay between technology, craftsmanship, and nature.</em> 
                  <br />
                  <br />
                  I believe there's a quiet philosophy in creating things with intention, taking thoughtful risks, and embracing hands-on experiences.
                </p>
                <p>
                <span className="font-semibold">Above all, my deepest joy comes from my (currently small) family - the ultimate reminder of what's truly valuable.</span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-4">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-screen-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
            <div>
              <p className="text-xs text-gray-500">Published 2/26/2025 · © Keyana Sapp</p>
              <p className="text-xs text-gray-400 italic">If you want to improve, be content to be thought foolish and stupid</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">
                Say hello:
                <a href="mailto:hello@keyana.io" className="ml-2 text-gray-300 hover:text-white transition duration-300">Email</a>
                <span className="mx-2 text-gray-600">·</span>
                <a href="https://twitter.com/keyanasapp" className="text-gray-300 hover:text-white transition duration-300">X</a>
                <span className="mx-2 text-gray-600">·</span>
                <a href="https://linkedin.com/in/keyanasapp" className="text-gray-300 hover:text-white transition duration-300">LinkedIn</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;