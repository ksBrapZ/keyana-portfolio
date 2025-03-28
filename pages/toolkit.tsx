// pages/toolkit.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { ExternalLink, Wrench, Package, BookOpen, Users, Music, Film, Mic, Book } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ExpandableTabs, type TabItem } from "@/components/ui/expandable-tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { cn, shuffleArray } from "@/lib/utils";

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
}

// Import the JSON data
import toolkitData from '../data/toolkit.json';

// Color mapping for types as Badge variant
const getTypeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
  const typeMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    // Development tools
    'Development': 'default',
    'Design': 'secondary',
    'Productivity': 'outline',
    
    // Products
    'Vehicles': 'destructive',
    'Tech': 'default',
    'Audio': 'secondary',
    'Gear': 'outline',
    'Home Goods': 'outline',
    
    // Default for any other type
    'default': 'default'
  };
  
  return typeMap[type] || typeMap.default;
};

const Toolkit: NextPage = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tableHeight, setTableHeight] = useState<string>("500px");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  // Create state for randomized data
  const [randomizedData, setRandomizedData] = useState<ToolkitData>({
    tools: [],
    products: [],
    media: {
      books: [],
      podcasts: [],
      tvfilm: [],
      music: []
    }
  });
  
  // Handle scroll effect for sticky header
  useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);
  
  // Randomize data on initial load
  useEffect(() => {
    setRandomizedData({
      tools: shuffleArray(toolkitData.tools),
      products: shuffleArray(toolkitData.products),
      media: {
        books: shuffleArray(toolkitData.media.books),
        podcasts: shuffleArray(toolkitData.media.podcasts),
        tvfilm: shuffleArray(toolkitData.media.tvfilm),
        music: shuffleArray(toolkitData.media.music)
      }
    });
  }, []);
  
  // Re-randomize the specific category when tab changes
  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
    
    // Only re-randomize the data for the selected tab to avoid unnecessary computations
    const newRandomizedData = { ...randomizedData };
    
    // Based on tab index, shuffle the appropriate section
    switch (tabIndex) {
      case 0: // Tools
        newRandomizedData.tools = shuffleArray(toolkitData.tools);
        break;
      case 1: // Products
        newRandomizedData.products = shuffleArray(toolkitData.products);
        break;
      case 3: // Books
        newRandomizedData.media.books = shuffleArray(toolkitData.media.books);
        break;
      case 4: // Podcasts
        newRandomizedData.media.podcasts = shuffleArray(toolkitData.media.podcasts);
        break;
      case 5: // TV & Film
        newRandomizedData.media.tvfilm = shuffleArray(toolkitData.media.tvfilm);
        break;
      case 6: // Music
        newRandomizedData.media.music = shuffleArray(toolkitData.media.music);
        break;
    }
    
    setRandomizedData(newRandomizedData);
  };
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      // If we're switching between desktop and mobile views,
      // we may need to recalculate layout dimensions
      if (isMobileView !== isMobile) {
        // Force layout recalculation in the next animation frame
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event('resize'));
        });
      }
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);
  
  // Adjust table height based on window size
  useEffect(() => {
    const updateTableHeight = () => {
      // Only adjust the table height for desktop view
      if (!isMobile) {
        // Calculate available height (viewport height minus header, tabs, and footer)
        const headerHeight = 200; // Approximate header height
        const tabsHeight = 60;    // Approximate tabs height
        const footerHeight = 100; // Approximate footer height
        const padding = 80;       // Additional padding
        
        const availableHeight = window.innerHeight - (headerHeight + tabsHeight + footerHeight + padding);
        // Set a minimum height to prevent tiny tables
        const finalHeight = Math.max(300, availableHeight);
        
        setTableHeight(`${finalHeight}px`);
      }
    };
    
    // Initial calculation
    updateTableHeight();
    
    // Update on resize
    window.addEventListener('resize', updateTableHeight);
    return () => window.removeEventListener('resize', updateTableHeight);
  }, [isMobile]);

  // Add custom scrollbar styles
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style');
    
    // Define scrollbar styles
    const scrollbarStyles = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(155, 155, 155, 0.5);
        border-radius: 20px;
        border: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(155, 155, 155, 0.7);
      }
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
      }
    `;
    
    styleEl.textContent = scrollbarStyles;
    document.head.appendChild(styleEl);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const tabs: TabItem[] = [
    { title: "Tools", icon: Wrench },
    { title: "Products", icon: Package },
    { type: "separator" as const },
    { title: "Books", icon: Book },
    { title: "Podcasts", icon: Mic },
    { title: "TV & Film", icon: Film },
    { title: "Music", icon: Music }
  ];

  // Reusable link component
  const ExternalItemLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a 
      href={href} 
      className="text-primary hover:text-primary/80 transition-colors inline-flex items-center" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );

  // Mobile card component
  const MobileCard = ({ 
    children, 
    className = ""
  }: { 
    children: React.ReactNode, 
    className?: string 
  }) => (
    <div className={`rounded-xl border border-border/50 dark:border-border/20 bg-card/5 p-3 ${className}`}>
      {children}
    </div>
  );

  // Scrollable container for mobile cards
  const ScrollableCards = ({ children }: { children: React.ReactNode }) => (
    <div className="space-y-2">
      {children}
    </div>
  );

  // Table wrapper component with scrolling - completely redesigned approach
  const ScrollableTable = ({ headers, children }: { headers: React.ReactNode, children: React.ReactNode }) => (
    <div className="rounded-xl border border-border/50 dark:border-border/20 bg-card/5 overflow-hidden">
      {/* Fixed header */}
      <div className="bg-background border-b border-border/50 dark:border-border/15 sticky top-0 left-0 right-0 z-10">
        {headers}
      </div>
      
      {/* Scrollable content */}
      <div 
        style={{ 
          height: tableHeight, 
          overflowY: 'auto',
          // Custom scrollbar styling
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent'
        }} 
        className="custom-scrollbar"
      >
        {children}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 0: // Tools
        if (isMobile) {
          return (
            <ScrollableCards>
              {randomizedData.tools.map((tool) => (
                <MobileCard key={tool.id} className="h-auto">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm truncate max-w-[70%]">
                      <ExternalItemLink href={tool.url}>
                        {tool.name}
                      </ExternalItemLink>
                    </h3>
                    <Badge variant={getTypeVariant(tool.type)} className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1">
                      {tool.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">{tool.description}</p>
                </MobileCard>
              ))}
            </ScrollableCards>
          );
        }
        
        return (
          <ScrollableTable
            headers={
              <div className="grid grid-cols-[200px_1fr_120px] gap-4 w-full px-4 py-3 text-sm font-medium text-muted-foreground">
                <div className="text-left">Name</div>
                <div className="text-left">Description</div>
                <div className="text-left">Type</div>
              </div>
            }
          >
            <div>
              {randomizedData.tools.map((tool, index) => (
                <div 
                  key={tool.id} 
                  className={`grid grid-cols-[200px_1fr_120px] gap-4 w-full px-4 py-3 items-center border-b border-border/50 dark:border-border/15 ${
                    index === randomizedData.tools.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="font-medium">
                    <ExternalItemLink href={tool.url}>
                      {tool.name}
                    </ExternalItemLink>
                  </div>
                  <div className="text-muted-foreground">{tool.description}</div>
                  <div>
                    <Badge variant={getTypeVariant(tool.type)}>
                      {tool.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollableTable>
        );
      case 1: // Products
        if (isMobile) {
          return (
            <ScrollableCards>
              {randomizedData.products.map((product) => (
                <MobileCard key={product.id} className="h-auto">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm truncate max-w-[70%]">
                      <ExternalItemLink href={product.url}>
                        {product.name}
                      </ExternalItemLink>
                    </h3>
                    <Badge variant={getTypeVariant(product.type)} className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1">
                      {product.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">{product.description}</p>
                </MobileCard>
              ))}
            </ScrollableCards>
          );
        }
        
        return (
          <ScrollableTable
            headers={
              <div className="grid grid-cols-[200px_1fr_120px] gap-4 w-full px-4 py-3 text-sm font-medium text-muted-foreground">
                <div className="text-left">Name</div>
                <div className="text-left">Description</div>
                <div className="text-left">Type</div>
              </div>
            }
          >
            <div>
              {randomizedData.products.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`grid grid-cols-[200px_1fr_120px] gap-4 w-full px-4 py-3 items-center border-b border-border/50 dark:border-border/15 ${
                    index === randomizedData.products.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="font-medium">
                    <ExternalItemLink href={product.url}>
                      {product.name}
                    </ExternalItemLink>
                  </div>
                  <div className="text-muted-foreground">{product.description}</div>
                  <div>
                    <Badge variant={getTypeVariant(product.type)}>
                      {product.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollableTable>
        );
      case 3: // Books
        if (isMobile) {
          return (
            <ScrollableCards>
              {randomizedData.media.books.map((book) => (
                <MobileCard key={book.id} className="h-auto">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm truncate max-w-[70%]">
                      <ExternalItemLink href={book.url}>
                        {book.title}
                      </ExternalItemLink>
                    </h3>
                    <Badge variant={getTypeVariant(book.tag)} className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1">
                      {book.tag}
                    </Badge>
                  </div>
                  <div className="text-xs mt-0.5 text-primary/80">by {book.author}</div>
                  <p className="text-muted-foreground text-xs mt-0.5">{book.description}</p>
                </MobileCard>
              ))}
            </ScrollableCards>
          );
        }
        
        return (
          <ScrollableTable
            headers={
              <div className="grid grid-cols-[200px_150px_1fr_120px] gap-4 w-full px-4 py-3 text-sm font-medium text-muted-foreground">
                <div className="text-left">Title</div>
                <div className="text-left">Author</div>
                <div className="text-left">Description</div>
                <div className="text-left">Genre</div>
              </div>
            }
          >
            <div>
              {randomizedData.media.books.map((book, index) => (
                <div 
                  key={book.id} 
                  className={`grid grid-cols-[200px_150px_1fr_120px] gap-4 w-full px-4 py-3 items-center border-b border-border/50 dark:border-border/15 ${
                    index === randomizedData.media.books.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="font-medium">
                    <ExternalItemLink href={book.url}>
                      {book.title}
                    </ExternalItemLink>
                  </div>
                  <div>{book.author}</div>
                  <div className="text-muted-foreground">{book.description}</div>
                  <div>
                    <Badge variant={getTypeVariant(book.tag)}>
                      {book.tag}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollableTable>
        );
      case 4: // Podcasts
        if (isMobile) {
          return (
            <ScrollableCards>
              {randomizedData.media.podcasts.map((podcast) => (
                <MobileCard key={podcast.id} className="h-auto">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm truncate max-w-[70%]">
                      <ExternalItemLink href={podcast.url}>
                        {podcast.name}
                      </ExternalItemLink>
                    </h3>
                    <Badge variant={getTypeVariant(podcast.type)} className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1">
                      {podcast.type}
                    </Badge>
                  </div>
                  <div className="text-xs mt-0.5 text-primary/80">Hosted by {podcast.hosts}</div>
                  <p className="text-muted-foreground text-xs mt-0.5">{podcast.description}</p>
                </MobileCard>
              ))}
            </ScrollableCards>
          );
        }
        
        return (
          <ScrollableTable
            headers={
              <div className="grid grid-cols-[200px_150px_1fr_120px] gap-4 w-full px-4 py-3 text-sm font-medium text-muted-foreground">
                <div className="text-left">Name</div>
                <div className="text-left">Hosts</div>
                <div className="text-left">Description</div>
                <div className="text-left">Type</div>
              </div>
            }
          >
            <div>
              {randomizedData.media.podcasts.map((podcast, index) => (
                <div 
                  key={podcast.id} 
                  className={`grid grid-cols-[200px_150px_1fr_120px] gap-4 w-full px-4 py-3 items-center border-b border-border/50 dark:border-border/15 ${
                    index === randomizedData.media.podcasts.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="font-medium">
                    <ExternalItemLink href={podcast.url}>
                      {podcast.name}
                    </ExternalItemLink>
                  </div>
                  <div>{podcast.hosts}</div>
                  <div className="text-muted-foreground">{podcast.description}</div>
                  <div>
                    <Badge variant={getTypeVariant(podcast.type)}>
                      {podcast.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollableTable>
        );
      case 5: // TV & Film
        if (isMobile) {
          return (
            <ScrollableCards>
              {randomizedData.media.tvfilm.map((item) => (
                <MobileCard key={item.id} className="h-auto">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm truncate max-w-[70%]">
                      <ExternalItemLink href={item.url}>
                        {item.name}
                      </ExternalItemLink>
                    </h3>
                    <Badge variant={getTypeVariant(item.type)} className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">{item.description}</p>
                </MobileCard>
              ))}
            </ScrollableCards>
          );
        }
        
        return (
          <ScrollableTable
            headers={
              <div className="grid grid-cols-[200px_1fr_120px] gap-4 w-full px-4 py-3 text-sm font-medium text-muted-foreground">
                <div className="text-left">Name</div>
                <div className="text-left">Description</div>
                <div className="text-left">Type</div>
              </div>
            }
          >
            <div>
              {randomizedData.media.tvfilm.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-[200px_1fr_120px] gap-4 w-full px-4 py-3 items-center border-b border-border/50 dark:border-border/15 ${
                    index === randomizedData.media.tvfilm.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="font-medium">
                    <ExternalItemLink href={item.url}>
                      {item.name}
                    </ExternalItemLink>
                  </div>
                  <div className="text-muted-foreground">{item.description}</div>
                  <div>
                    <Badge variant={getTypeVariant(item.type)}>
                      {item.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollableTable>
        );
      case 6: // Music
        if (isMobile) {
          return (
            <ScrollableCards>
              {randomizedData.media.music.map((item) => (
                <MobileCard key={item.id} className="h-auto">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm truncate max-w-[70%]">
                      <ExternalItemLink href={item.url}>
                        {item.song}
                      </ExternalItemLink>
                    </h3>
                    <Badge variant={getTypeVariant(item.type)} className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1">
                      {item.type}
                    </Badge>
                  </div>
                  <div className="inline-flex gap-2 items-center mt-0.5">
                    <span className="text-xs text-primary/80">{item.artist}</span>
                    <span className="text-xs text-muted-foreground">• {item.album}</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">{item.description}</p>
                </MobileCard>
              ))}
            </ScrollableCards>
          );
        }
        
        return (
          <ScrollableTable
            headers={
              <div className="grid grid-cols-[200px_150px_150px_1fr_120px] gap-4 w-full px-4 py-3 text-sm font-medium text-muted-foreground">
                <div className="text-left">Song</div>
                <div className="text-left">Artist</div>
                <div className="text-left">Album</div>
                <div className="text-left">Description</div>
                <div className="text-left">Type</div>
              </div>
            }
          >
            <div>
              {randomizedData.media.music.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-[200px_150px_150px_1fr_120px] gap-4 w-full px-4 py-3 items-center border-b border-border/50 dark:border-border/15 ${
                    index === randomizedData.media.music.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="font-medium">
                    <ExternalItemLink href={item.url}>
                      {item.song}
                    </ExternalItemLink>
                  </div>
                  <div>{item.artist}</div>
                  <div>{item.album}</div>
                  <div className="text-muted-foreground">{item.description}</div>
                  <div>
                    <Badge variant={getTypeVariant(item.type)}>
                      {item.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollableTable>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-light">
      <Head>
        <title>Toolkit | Keyana Sapp</title>
        <meta name="description" content="Keyana Sapp's toolkit of favorite tools, products, media, and people" />
        
        {/* Favicon configuration */}
        <link rel="icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <Header />

      <main className="py-3 flex-1">
        <div className="container mx-auto px-4 md:px-12 lg:px-16 max-w-screen-lg">
          <div className="w-full max-w-4xl mx-auto mb-6">
            <h1 className="text-2xl font-medium mb-3">Toolkit</h1>
            <p className="text-muted-foreground">
              A curated collection of tools, products, media, and people that I find valuable, use regularly, or admire.
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto pb-6">
            <div 
              className={`${
                isMobile 
                  ? `sticky top-3 z-20 flex justify-center px-4 transition-all duration-300`
                  : 'mb-2'
              }`}
            >
              <div 
                className={`${
                  isMobile 
                    ? `inline-flex rounded-full px-3 py-1.5 bg-background/50 backdrop-blur-md border ${
                        isScrolled 
                          ? 'border-border/20 shadow-md' 
                          : 'border-transparent'
                      } transition-all duration-300 ${
                        isScrolled ? 'scale-[0.95] transform-gpu' : ''
                      }`
                    : ''
                }`}
              >
                <ExpandableTabs 
                  tabs={tabs} 
                  defaultValue={activeTab}
                  onChange={handleTabChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className={isMobile ? 'mt-4' : ''}>
              {renderContent()}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Toolkit;