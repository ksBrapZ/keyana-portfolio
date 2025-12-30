// pages/toolkit.tsx
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
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

const Toolkit: NextPage = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tableHeight, setTableHeight] = useState<string>("400px");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  // Swipe detection state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  
  // Swipe animation state
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [swipeProgress, setSwipeProgress] = useState<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  // Motion values for smooth animations
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  
  // Transform for opacity and blur based on swipe progress
  const opacity = useTransform(springX, (val) => {
    const abs = Math.abs(val);
    return Math.max(0.4, 1 - abs / 300);
  });
  const blurValue = useTransform(springX, (val) => {
    const abs = Math.abs(val);
    return `blur(${Math.min(8, abs / 25)}px)`;
  });
  
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
  
  // Function to calculate table height based on screen size
  const calculateTableHeight = () => {
    if (isMobile) {
      return "400px"; // Default height for mobile
    }
    
    // Calculate available space
    const headerHeight = 80; 
    const topContentHeight = 180; // Increased to account for title + description + tabs
    const footerHeight = 80; // Increased to ensure we don't cut off the bottom
    const padding = 100; // Additional padding to ensure visible separation
    
    const availableHeight = window.innerHeight - (headerHeight + topContentHeight + footerHeight + padding);
    const minHeight = 400; // Minimum height for the table
    
    return `${Math.max(availableHeight, minHeight)}px`;
  };
  
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
  
  // Update table height based on screen size
  useEffect(() => {
    const updateTableHeight = () => {
      setTableHeight(calculateTableHeight());
    };
    
    // Update on mount and resize
    updateTableHeight();
    window.addEventListener('resize', updateTableHeight);
    
    return () => window.removeEventListener('resize', updateTableHeight);
  }, [isMobile, activeTab]);
  
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
  
  // Store handleTabChange in a ref to avoid dependency issues
  const handleTabChangeRef = useRef<(tabIndex: number) => void>();

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
    
    // Table height will be updated via the useEffect that depends on activeTab
  };

  // Update ref whenever handleTabChange changes
  useEffect(() => {
    handleTabChangeRef.current = handleTabChange;
  }, [handleTabChange]);

  // Reset animation when tab changes (for programmatic changes)
  useEffect(() => {
    x.set(0);
    setIsSwiping(false);
    setSwipeProgress(0);
    setSwipeDirection(null);
  }, [activeTab, x]);
  
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

  // Get array of valid tab indices (excluding separators)
  const validTabIndices = tabs
    .map((tab, index) => (tab.type !== "separator" ? index : null))
    .filter((index): index is number => index !== null);

  // Find the current position in valid tabs array
  const getCurrentValidTabIndex = () => {
    return validTabIndices.indexOf(activeTab);
  };

  // Swipe handlers
  const minSwipeDistance = 50; // Minimum distance for a swipe

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    
    // Don't handle swipe if touch starts on interactive elements (links, buttons, etc.)
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
      return;
    }
    
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !touchStart) return;
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEnd = () => {
    if (!isMobile || !touchStart || !touchEnd) {
      // Reset if incomplete
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = Math.abs(touchStart.y - touchEnd.y);
    
    // Only trigger swipe if horizontal movement is greater than vertical (primarily horizontal swipe)
    // and exceeds minimum distance
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > deltaY) {
      const isLeftSwipe = deltaX > 0;
      const isRightSwipe = deltaX < 0;
      const currentValidIndex = getCurrentValidTabIndex();
      
      if (isLeftSwipe && currentValidIndex < validTabIndices.length - 1) {
        // Swipe left - go to next tab
        const nextTabIndex = validTabIndices[currentValidIndex + 1];
        handleTabChange(nextTabIndex);
      } else if (isRightSwipe && currentValidIndex > 0) {
        // Swipe right - go to previous tab
        const prevTabIndex = validTabIndices[currentValidIndex - 1];
        handleTabChange(prevTabIndex);
      }
    }
    
    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Add native touch event listeners for swipe detection (more reliable on mobile)
  useEffect(() => {
    if (!isMobile) return;

    const minSwipeDist = 50;
    const maxSwipeDist = 200; // Maximum distance for progress calculation
    let touchStartPos: { x: number; y: number } | null = null;
    let touchEndPos: { x: number; y: number } | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      // Don't handle swipe if touch starts on interactive elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        return;
      }

      // Don't handle if touch starts in header or footer
      if (target.closest('header') || target.closest('footer')) {
        return;
      }

      touchEndPos = null;
      touchStartPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      setIsSwiping(false);
      setSwipeProgress(0);
      setSwipeDirection(null);
      x.set(0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartPos) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = touchStartPos.x - currentX;
      const deltaY = Math.abs(touchStartPos.y - currentY);
      
      // Only track if primarily horizontal movement
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
        setIsSwiping(true);
        setSwipeDirection(deltaX > 0 ? 'left' : 'right');
        
        // Calculate progress (0 to 1)
        const progress = Math.min(Math.abs(deltaX) / maxSwipeDist, 1);
        setSwipeProgress(progress);
        
        // Update motion value for smooth animation
        x.set(-deltaX);
      }
      
      touchEndPos = {
        x: currentX,
        y: currentY
      };
    };

    const handleTouchEnd = () => {
      if (!touchStartPos || !touchEndPos) {
        // Reset animation
        x.set(0);
        setIsSwiping(false);
        setSwipeProgress(0);
        setSwipeDirection(null);
        touchStartPos = null;
        touchEndPos = null;
        return;
      }

      const deltaX = touchStartPos.x - touchEndPos.x;
      const deltaY = Math.abs(touchStartPos.y - touchEndPos.y);

      // Only trigger swipe if horizontal movement is greater than vertical
      // and exceeds minimum distance
      if (Math.abs(deltaX) > minSwipeDist && Math.abs(deltaX) > deltaY) {
        const isLeftSwipe = deltaX > 0;
        const isRightSwipe = deltaX < 0;
        
        // Calculate current valid index inline
        const currentValidIndex = validTabIndices.indexOf(activeTab);

        if (isLeftSwipe && currentValidIndex < validTabIndices.length - 1) {
          // Swipe left - go to next tab
          const nextTabIndex = validTabIndices[currentValidIndex + 1];
          // Animate out smoothly
          x.set(-window.innerWidth * 0.3);
          setTimeout(() => {
            handleTabChangeRef.current?.(nextTabIndex);
            // Reset will happen via useEffect when activeTab changes
          }, 150);
        } else if (isRightSwipe && currentValidIndex > 0) {
          // Swipe right - go to previous tab
          const prevTabIndex = validTabIndices[currentValidIndex - 1];
          // Animate out smoothly
          x.set(window.innerWidth * 0.3);
          setTimeout(() => {
            handleTabChangeRef.current?.(prevTabIndex);
            // Reset will happen via useEffect when activeTab changes
          }, 150);
        } else {
          // Snap back if swipe wasn't valid
          x.set(0);
          setIsSwiping(false);
          setSwipeProgress(0);
          setSwipeDirection(null);
        }
      } else {
        // Snap back if swipe wasn't sufficient
        x.set(0);
        setIsSwiping(false);
        setSwipeProgress(0);
        setSwipeDirection(null);
      }

      touchStartPos = null;
      touchEndPos = null;
    };

    // Use passive listeners for better performance
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isMobile, activeTab, validTabIndices]);

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

  // Table wrapper component with scrolling
  const ScrollableTable = ({ headers, children }: { headers: React.ReactNode, children: React.ReactNode }) => (
    <div className="rounded-xl border border-border/50 dark:border-border/20 bg-card/5 overflow-hidden mb-2">
      {/* Fixed header */}
      <div className="bg-background border-b border-border/50 dark:border-border/15 sticky top-0 left-0 right-0 z-10">
        {headers}
      </div>
      
      {/* Scrollable content */}
      <div 
        style={{ 
          height: tableHeight,
          overflowY: 'auto'
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
                    <Badge className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
                    <Badge className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
                    <Badge className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
                    <Badge className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
                    <Badge className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
                    <Badge className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
                    <Badge className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
                    <Badge className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
                    <Badge className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
                    <Badge className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
                    <Badge className="text-xs px-1.5 py-0 h-[18px] shrink-0 ml-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
                    <Badge className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-transparent text-black dark:text-white">
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
    <div className={`${isMobile ? 'min-h-screen' : 'h-screen overflow-hidden'} flex flex-col bg-background text-foreground font-light`}>
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

      <main className={`${isMobile ? '' : 'overflow-hidden'} flex-1 flex flex-col`}>
        <div className="container mx-auto px-4 md:px-12 lg:px-16 max-w-screen-lg h-full flex flex-col">
          <div className="w-full max-w-4xl mx-auto mb-6 pt-3">
            <h1 className="text-2xl font-medium mb-2">Toolkit</h1>
            <p className="text-muted-foreground">
              Whenever I find a product, book, podcast, movie, or song that I love, I add it to my toolkit.
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto flex flex-col mb-10">
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
                  value={activeTab}
                  onChange={handleTabChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className={`${isMobile ? 'mt-4' : ''} pb-4 relative overflow-hidden`}>
              {/* Edge indicators for swipe hint */}
              {isMobile && (
                <>
                  {/* Left edge indicator - shows when can swipe right */}
                  <AnimatePresence>
                    {(() => {
                      const currentValidIndex = validTabIndices.indexOf(activeTab);
                      return currentValidIndex > 0 && !isSwiping;
                    })() && (
                      <motion.div
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 0.4, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
                      >
                        <div className="w-0.5 h-20 bg-primary/30 rounded-r-full" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Right edge indicator - shows when can swipe left */}
                  <AnimatePresence>
                    {(() => {
                      const currentValidIndex = validTabIndices.indexOf(activeTab);
                      return currentValidIndex < validTabIndices.length - 1 && !isSwiping;
                    })() && (
                      <motion.div
                        initial={{ opacity: 0, x: 4 }}
                        animate={{ opacity: 0.4, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        transition={{ duration: 0.3 }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
                      >
                        <div className="w-0.5 h-20 bg-primary/30 rounded-l-full" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
              
              {/* Content with swipe animation and glass effect */}
              <motion.div
                style={{
                  x: springX,
                }}
                className="relative"
              >
                {/* Glass overlay during swipe */}
                <motion.div
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{
                    background: useTransform(springX, (val) => {
                      if (val === 0) return 'transparent';
                      return val < 0
                        ? 'linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 60%)'
                        : 'linear-gradient(to left, rgba(255,255,255,0.08) 0%, transparent 60%)';
                    }),
                    backdropFilter: 'blur(2px)',
                    opacity: useTransform(springX, (val) => {
                      const abs = Math.abs(val);
                      return Math.min(0.6, abs / 150);
                    }),
                  }}
                />
                
                {/* Content with blur effect */}
                <motion.div
                  style={{
                    filter: blurValue,
                    opacity: opacity,
                  }}
                >
                  {renderContent()}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Toolkit;