import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Extract headings from content
  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      // Only include h2 and h3 in TOC
      if (level >= 2 && level <= 3) {
        headings.push({ id, text, level });
      }
    }

    setTocItems(headings);
  }, [content]);

  // Track active heading based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -80% 0px',
        threshold: 0.1,
      }
    );

    const headingElements = document.querySelectorAll('h2, h3');
    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
    };
  }, [tocItems]);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav className="text-sm">
      <ul className="space-y-2">
        {tocItems.map((item) => (
          <li 
            key={item.id} 
            className={cn(
              item.level === 2 ? 'mt-2' : 'ml-3 mt-1'
            )}
          >
            <Link
              href={`#${item.id}`}
              className={cn(
                'block hover:text-primary py-1',
                activeId === item.id ? 'text-primary font-medium' : 'text-muted-foreground',
                item.level === 3 && 'text-xs'
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
} 