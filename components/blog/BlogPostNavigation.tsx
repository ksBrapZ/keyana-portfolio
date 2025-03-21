import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPost } from '@/lib/blog';

interface BlogPostNavigationProps {
  nextPost: BlogPost | null;
  prevPost: BlogPost | null;
}

export default function BlogPostNavigation({ nextPost, prevPost }: BlogPostNavigationProps) {
  if (!nextPost && !prevPost) return null;

  return (
    <div className="w-full">
      <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prevPost && (
          <Link 
            href={`/blog/${prevPost.slug}`}
            className="group flex flex-col p-4 rounded-lg border border-border/50 dark:border-border/20 transition-all hover:bg-muted/50 hover:border-border"
          >
            <span className="text-sm text-muted-foreground flex items-center mb-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous Post
            </span>
            <span className="font-medium group-hover:text-primary transition-colors line-clamp-2">
              {prevPost.frontmatter.title}
            </span>
          </Link>
        )}
        
        {nextPost && (
          <Link 
            href={`/blog/${nextPost.slug}`}
            className={`group flex flex-col p-4 rounded-lg border border-border/50 dark:border-border/20 transition-all hover:bg-muted/50 hover:border-border ${!prevPost ? 'md:col-start-2' : ''}`}
          >
            <span className="text-sm text-muted-foreground flex items-center justify-end mb-2">
              Next Post
              <ChevronRight className="h-4 w-4 ml-1" />
            </span>
            <span className="font-medium text-right group-hover:text-primary transition-colors line-clamp-2">
              {nextPost.frontmatter.title}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
} 