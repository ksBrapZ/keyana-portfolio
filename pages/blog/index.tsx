import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { getAllPosts, BlogPost } from '@/lib/blog';
import BlogCard from '@/components/blog/BlogCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BlogIndexProps {
  posts: BlogPost[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  const [contentHeight, setContentHeight] = useState<string>("calc(100vh - 280px)");

  // Adjust content height based on window size
  useEffect(() => {
    const updateContentHeight = () => {
      // Calculate available height (viewport height minus header and footer)
      const headerHeight = 150; // Approximate header height
      const footerHeight = 80; // Approximate footer height
      const padding = 50; // Additional padding
      
      const availableHeight = window.innerHeight - (headerHeight + footerHeight + padding);
      // Set a minimum height to prevent tiny content area
      const finalHeight = Math.max(300, availableHeight);
      
      setContentHeight(`${finalHeight}px`);
    };
    
    // Initial calculation
    updateContentHeight();
    
    // Update on resize
    window.addEventListener('resize', updateContentHeight);
    return () => window.removeEventListener('resize', updateContentHeight);
  }, []);

  // Add custom scrollbar styles
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style');
    
    // Define scrollbar styles
    const scrollbarStyles = `
      .blog-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .blog-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .blog-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(155, 155, 155, 0);
        border-radius: 20px;
        border: transparent;
        transition: background-color 0.2s ease;
      }
      .blog-scrollbar:hover::-webkit-scrollbar-thumb {
        background-color: rgba(155, 155, 155, 0.3);
      }
      .blog-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(155, 155, 155, 0.5);
      }
      .blog-scrollbar::-webkit-scrollbar-thumb:active {
        background-color: rgba(155, 155, 155, 0.7);
      }
      .blog-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
      }
      .blog-scrollbar:hover {
        scrollbar-color: rgba(155, 155, 155, 0.3) transparent;
      }
    `;
    
    styleEl.textContent = scrollbarStyles;
    document.head.appendChild(styleEl);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Blog | Keyana Sapp</title>
        <meta name="description" content="Thoughts and writings by Keyana Sapp" />
      </Head>
      
      <div className="h-screen flex flex-col bg-background text-foreground font-light">
        <Header />
        
        <main className="flex-grow container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg py-3 overflow-hidden">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Blog</h1>
            <p className="text-muted-foreground">Thoughts and writings on design, development, and more.</p>
          </div>
          
          <div 
            className="blog-scrollbar overflow-y-auto"
            style={{ height: contentHeight }}
          >
            {posts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pb-12">
                {posts.map((post) => (
                  <BlogCard key={post.slug} {...post} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">No posts yet. Check back soon!</p>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();
  
  return {
    props: {
      posts,
    },
  };
}; 