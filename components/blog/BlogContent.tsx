import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate, calculateReadingTime } from '@/lib/blog';
import { Separator } from '@/components/ui/separator'; 
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { PostFrontmatter } from '@/lib/blog';

interface BlogContentProps {
  frontmatter: PostFrontmatter;
  content: string;
}

export default function BlogContent({ frontmatter, content }: BlogContentProps) {
  const { title, date, tags } = frontmatter;
  const formattedDate = formatDate(date);
  const readingTime = calculateReadingTime(content);

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="mb-6">
          <Link href="/blog" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to all posts
          </Link>
          
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <time dateTime={date}>{formattedDate}</time>
            <span className="mx-2">·</span>
            <span>{readingTime} min read</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Separator className="mb-8 bg-border/40" />
      </div>

      <div className="prose prose-invert prose-zinc max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-8 mb-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
            p: ({ node, ...props }) => <p className="my-4 leading-relaxed" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4" {...props} />,
            li: ({ node, ...props }) => <li className="my-1" {...props} />,
            a: ({ node, ...props }) => (
              <a className="text-primary hover:underline" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="pl-4 border-l-2 border-muted-foreground italic my-4" {...props} />
            ),
            code: ({ node, inline, ...props }) => 
              inline ? 
                <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} /> : 
                <pre className="bg-muted p-4 rounded-md overflow-x-auto my-4 text-sm">
                  <code {...props} />
                </pre>
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
} 