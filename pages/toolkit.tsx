// pages/toolkit.tsx
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { NextPage } from 'next';

// Define types for our toolkit data
interface ToolkitItem {
  id: number;
  name: string;
  description: string;
  url: string;
  type: string;
}

interface BookItem {
  id: number;
  title: string;
  author: string;
  description: string;
  url: string;
  tag: string;
}

interface PodcastItem {
  id: number;
  name: string;
  hosts: string;
  description: string;
  url: string;
  type: string;
}

interface TVFilmItem {
  id: number;
  name: string;
  description: string;
  url: string;
  type: string;
}

interface MusicItem {
  id: number;
  song: string;
  artist: string;
  album: string;
  description: string;
  url: string;
  type: string;
}

interface MediaData {
  books: BookItem[];
  podcasts: PodcastItem[];
  tvfilm: TVFilmItem[];
  music: MusicItem[];
}

interface ToolkitData {
  tools: ToolkitItem[];
  products: ToolkitItem[];
  media: MediaData;
  people: ToolkitItem[];
}

// Import the JSON data
import toolkitData from '../data/toolkit.json';

// Color mapping for types
const getTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    // Development tools
    'Development': 'bg-blue-600',
    'Design': 'bg-purple-600',
    'Productivity': 'bg-green-600',
    
    // Products
    'Vehicles': 'bg-red-600',
    'Tech': 'bg-indigo-600',
    'Audio': 'bg-pink-600',
    'Gear': 'bg-amber-600',
    'Home Goods': 'bg-emerald-600',
    
    // Media tags
    'Business': 'bg-sky-600',
    'Psychology': 'bg-violet-600',
    'Biography': 'bg-orange-600',
    'Fiction': 'bg-lime-600',
    'Philosophy': 'bg-cyan-600',
    'Interview': 'bg-rose-600',
    'Technology': 'bg-blue-600',
    'History': 'bg-amber-700',
    'Science': 'bg-emerald-700',
    'Economics': 'bg-purple-700',
    'News': 'bg-slate-600',
    'Drama': 'bg-red-700',
    'Documentary': 'bg-indigo-700',
    'Sci-Fi': 'bg-teal-600',
    'Thriller': 'bg-amber-800',
    'Rock': 'bg-red-800',
    'R&B': 'bg-purple-800',
    'Hip-Hop': 'bg-blue-800',
    'Electronic': 'bg-green-800',
    'Alternative': 'bg-indigo-800',
    
    // People
    'Entrepreneur': 'bg-amber-600',
    'Tech Leader': 'bg-sky-700',
    'Author': 'bg-emerald-600',
    'Academic': 'bg-violet-700',
    'Writer': 'bg-rose-700'
  };
  
  return colorMap[type] || 'bg-gray-600';
};

const Toolkit: NextPage = () => {
  const [activeMainTab, setActiveMainTab] = useState<'tools' | 'products' | 'media' | 'people'>('tools');
  const [activeMediaTab, setActiveMediaTab] = useState<'books' | 'podcasts' | 'tvfilm' | 'music'>('books');
  
  // Type component for displaying colored chips
  const TypeChip = ({ type }: { type: string }) => (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(type)}`}>
      {type}
    </span>
  );
  
  // Renders the tools and products table
  const renderToolsProductsTable = (items: ToolkitItem[]) => {
    return (
      <div className="overflow-y-auto h-[400px] border border-gray-700">
        <table className="w-full border-collapse">
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-900">
                <td className="py-4 px-6 border-r border-gray-700">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-medium text-white hover:text-blue-400 transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </td>
                <td className="py-4 px-6 border-r border-gray-700 text-gray-300">
                  {item.description}
                </td>
                <td className="py-4 px-6 text-center">
                  <TypeChip type={item.type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Renders the books table
  const renderBooksTable = (books: BookItem[]) => {
    return (
      <div className="overflow-y-auto h-[400px] border border-gray-700">
        <table className="w-full border-collapse">
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b border-gray-700 hover:bg-gray-900">
                <td className="py-4 px-6 border-r border-gray-700">
                  <a 
                    href={book.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-medium text-white hover:text-blue-400 transition-colors duration-200"
                  >
                    {book.title}
                  </a>
                </td>
                <td className="py-4 px-6 border-r border-gray-700 text-gray-300">
                  {book.author}
                </td>
                <td className="py-4 px-6 border-r border-gray-700 text-gray-300">
                  {book.description}
                </td>
                <td className="py-4 px-6 text-center">
                  <TypeChip type={book.tag} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Renders the podcasts table
  const renderPodcastsTable = (podcasts: PodcastItem[]) => {
    return (
      <div className="overflow-y-auto h-[400px] border border-gray-700">
        <table className="w-full border-collapse">
          <tbody>
            {podcasts.map((podcast) => (
              <tr key={podcast.id} className="border-b border-gray-700 hover:bg-gray-900">
                <td className="py-4 px-6 border-r border-gray-700">
                  <a 
                    href={podcast.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-medium text-white hover:text-blue-400 transition-colors duration-200"
                  >
                    {podcast.name}
                  </a>
                </td>
                <td className="py-4 px-6 border-r border-gray-700 text-gray-300">
                  {podcast.hosts}
                </td>
                <td className="py-4 px-6 border-r border-gray-700 text-gray-300">
                  {podcast.description}
                </td>
                <td className="py-4 px-6 text-center">
                  <TypeChip type={podcast.type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Renders the TV & Film table
  const renderTVFilmTable = (tvfilms: TVFilmItem[]) => {
    return (
      <div className="overflow-y-auto h-[400px] border border-gray-700">
        <table className="w-full border-collapse">
          <tbody>
            {tvfilms.map((item) => (
              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-900">
                <td className="py-4 px-6 border-r border-gray-700">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-medium text-white hover:text-blue-400 transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </td>
                <td className="py-4 px-6 border-r border-gray-700 text-gray-300">
                  {item.description}
                </td>
                <td className="py-4 px-6 text-center">
                  <TypeChip type={item.type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Renders the music table
  const renderMusicTable = (music: MusicItem[]) => {
    return (
      <div className="overflow-y-auto h-[400px] border border-gray-700">
        <table className="w-full border-collapse">
          <tbody>
            {music.map((item) => (
              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-900">
                <td className="py-4 px-6 border-r border-gray-700">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-medium text-white hover:text-blue-400 transition-colors duration-200"
                  >
                    {item.song}
                  </a>
                </td>
                <td className="py-4 px-6 border-r border-gray-700 text-gray-300">
                  {item.artist}
                </td>
                <td className="py-4 px-6 border-r border-gray-700 text-gray-300">
                  {item.album}
                </td>
                <td className="py-4 px-6 border-r border-gray-700 text-gray-300">
                  {item.description}
                </td>
                <td className="py-4 px-6 text-center">
                  <TypeChip type={item.type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Renders the people table
  const renderPeopleTable = (people: ToolkitItem[]) => {
    return (
      <div className="overflow-y-auto h-[400px] border border-gray-700">
        <table className="w-full border-collapse">
          <tbody>
            {people.map((person) => (
              <tr key={person.id} className="border-b border-gray-700 hover:bg-gray-900">
                <td className="py-4 px-6 border-r border-gray-700">
                  <a 
                    href={person.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-medium text-white hover:text-blue-400 transition-colors duration-200"
                  >
                    {person.name}
                  </a>
                </td>
                <td className="py-4 px-6 border-r border-gray-700 text-gray-300">
                  {person.description}
                </td>
                <td className="py-4 px-6 text-center">
                  <TypeChip type={person.type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Head>
        <title>Toolkit | Keyana Sapp</title>
        <meta name="description" content="Tools, products, books and people that Keyana Sapp recommends" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-6 md:px-12 lg:px-20 max-w-screen-lg py-6 flex-1">
        {/* Floating back button - positioned relative to the viewport */}
        <Link 
          href="/" 
          className="group fixed top-6 left-6 z-10 flex items-center justify-center focus:outline-none" 
          aria-label="Back to home"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-900/80 backdrop-blur-sm group-hover:bg-gray-800 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
        </Link>
        
        {/* Header with reduced margin */}
        <header className="mb-6">
          <h1 className="text-2xl font-medium tracking-tight">Keyana Sapp</h1>
          <p className="text-gray-400">Digital and analogue builder</p>
          <p className="text-gray-500 text-sm">Boulder, CO · 11:00 MST</p>
        </header>

        {/* Main Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-900 rounded-sm">
            <button 
              onClick={() => setActiveMainTab('tools')}
              className={`px-6 py-2 text-sm font-medium ${activeMainTab === 'tools' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Tools
            </button>
            <button 
              onClick={() => setActiveMainTab('products')}
              className={`px-6 py-2 text-sm font-medium ${activeMainTab === 'products' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Products
            </button>
            <button 
              onClick={() => setActiveMainTab('media')}
              className={`px-6 py-2 text-sm font-medium ${activeMainTab === 'media' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Media
            </button>
            <button 
              onClick={() => setActiveMainTab('people')}
              className={`px-6 py-2 text-sm font-medium ${activeMainTab === 'people' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              People
            </button>
          </div>
        </div>

        {/* Media Submenu - Only shown when media tab is active */}
        {activeMainTab === 'media' && (
          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-gray-800 rounded-sm">
              <button 
                onClick={() => setActiveMediaTab('books')}
                className={`px-4 py-1 text-xs font-medium ${activeMediaTab === 'books' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Books
              </button>
              <button 
                onClick={() => setActiveMediaTab('podcasts')}
                className={`px-4 py-1 text-xs font-medium ${activeMediaTab === 'podcasts' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Podcasts
              </button>
              <button 
                onClick={() => setActiveMediaTab('tvfilm')}
                className={`px-4 py-1 text-xs font-medium ${activeMediaTab === 'tvfilm' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                TV & Film
              </button>
              <button 
                onClick={() => setActiveMediaTab('music')}
                className={`px-4 py-1 text-xs font-medium ${activeMediaTab === 'music' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Music
              </button>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        <section className="mb-8">
          {activeMainTab === 'tools' && renderToolsProductsTable((toolkitData as ToolkitData).tools)}
          {activeMainTab === 'products' && renderToolsProductsTable((toolkitData as ToolkitData).products)}
          {activeMainTab === 'media' && activeMediaTab === 'books' && renderBooksTable((toolkitData as ToolkitData).media.books)}
          {activeMainTab === 'media' && activeMediaTab === 'podcasts' && renderPodcastsTable((toolkitData as ToolkitData).media.podcasts)}
          {activeMainTab === 'media' && activeMediaTab === 'tvfilm' && renderTVFilmTable((toolkitData as ToolkitData).media.tvfilm)}
          {activeMainTab === 'media' && activeMediaTab === 'music' && renderMusicTable((toolkitData as ToolkitData).media.music)}
          {activeMainTab === 'people' && renderPeopleTable((toolkitData as ToolkitData).people)}
        </section>
      </main>

      {/* Footer - Updated to match homepage styling */}
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

export default Toolkit;