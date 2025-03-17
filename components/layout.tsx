// components/Layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold">Keyana Sapp</h1>
          <p className="text-gray-400">Digital and analogue builder</p>
          <p className="text-gray-400">Boulder, CO</p>
          <p className="text-gray-400">11:00 MST</p>
        </header>
        
        {/* Right sidebar */}
        <aside className="fixed right-12 top-32 hidden md:block">
          <ul className="space-y-4">
            <li>
              <Link href="/writing" className={`${router.pathname === '/writing' ? 'text-white' : 'text-gray-400'} hover:text-white`}>
                Writing
              </Link>
            </li>
            <li>
              <Link href="/photos" className={`${router.pathname === '/photos' ? 'text-white' : 'text-gray-400'} hover:text-white`}>
                Photos
              </Link>
            </li>
            <li>
              <Link href="/toolkit" className={`${router.pathname === '/toolkit' ? 'text-white' : 'text-gray-400'} hover:text-white`}>
                Toolkit
              </Link>
            </li>
          </ul>
        </aside>
        
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-4 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-sm text-gray-400">Published 2/26/2025</p>
              <p className="text-sm text-gray-400">© Keyana Sapp</p>
              <p className="text-sm text-gray-400 italic">If you want to improve, be content to be thought foolish and stupid</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-400">
                Say hello: 
                <a href="mailto:hello@keyana.io" className="ml-1 text-white hover:underline">Email</a> / 
                <a href="https://twitter.com/keyanasapp" className="ml-1 text-white hover:underline">X</a> / 
                <a href="https://linkedin.com/in/keyanasapp" className="ml-1 text-white hover:underline">LinkedIn</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}