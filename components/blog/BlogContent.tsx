import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrism from 'rehype-prism-plus';
import { cn } from '@/lib/utils';
import { MDXImage } from './MDXImage';
import 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

interface BlogContentProps {
  content: string;
  className?: string;
}

export function BlogContent({ content, className }: BlogContentProps) {
  return (
    <div className={cn(
      "prose dark:prose-invert prose-lg max-w-none",
      // Headings
      "prose-headings:font-bold prose-headings:tracking-tight",
      // Links
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      // Lists
      "prose-ul:list-disc prose-ol:list-decimal",
      // Code
      "prose-code:bg-muted prose-code:text-foreground prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-[''] prose-code:after:content-['']",
      // Pre (code blocks)
      "prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-0",
      // Blockquotes
      "prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:not-italic",
      // Horizontal rule
      "prose-hr:border-border",
      // Images
      "prose-img:rounded-md",
      // Additional classname
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw, 
          rehypeSanitize,
          [rehypePrism, { showLineNumbers: true }]
        ]}
        components={{
          // Add custom components for rendering specific elements
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),
          img: ({ node, ...props }) => (
            <MDXImage {...props} />
          ),
          h1: ({ node, ...props }) => <HeadingWithAnchor level={1} {...props} />,
          h2: ({ node, ...props }) => <HeadingWithAnchor level={2} {...props} />,
          h3: ({ node, ...props }) => <HeadingWithAnchor level={3} {...props} />,
          h4: ({ node, ...props }) => <HeadingWithAnchor level={4} {...props} />,
          h5: ({ node, ...props }) => <HeadingWithAnchor level={5} {...props} />,
          h6: ({ node, ...props }) => <HeadingWithAnchor level={6} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

interface HeadingWithAnchorProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

function HeadingWithAnchor({ level, children, ...props }: HeadingWithAnchorProps) {
  // Convert heading text to slug for the anchor
  const text = React.Children.toArray(children).join('');
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.href.split('#')[0]}#${slug}`;
    navigator.clipboard.writeText(url);
    
    // Visual feedback
    const button = e.currentTarget as HTMLButtonElement;
    const originalText = button.textContent;
    button.textContent = "Copied!";
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  };

  return (
    <HeadingTag id={slug} className="group relative flex items-baseline" {...props}>
      <a href={`#${slug}`} className="absolute -left-6 opacity-0 group-hover:opacity-100 mr-2">
        <span className="sr-only">Link to section</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </a>
      {children}
      <button
        onClick={handleCopyLink}
        className="ml-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 align-middle"
        title="Copy link to this section"
      >
        Copy link
      </button>
    </HeadingTag>
  );
} 