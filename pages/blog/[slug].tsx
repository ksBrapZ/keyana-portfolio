import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPostSlugs, getPostBySlug, getAdjacentPosts, Post, PostMeta } from '@/lib/blog';
import { BlogContent } from '@/components/blog/BlogContent';
import { BlogSEO } from '@/components/blog/BlogSEO';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { TableOfContents } from '@/components/blog/TableOfContents';

interface BlogPostProps {
  post: Post;
  previousPost: PostMeta | null;
  nextPost: PostMeta | null;
}

export default function BlogPost({ post, previousPost, nextPost }: BlogPostProps) {
  const { meta, content } = post;

  return (
    <>
      <BlogSEO post={meta} />
      
      <article className="container max-w-4xl mx-auto px-4 py-10">
        {/* Back to blog button */}
        <div className="mb-8">
          <Link href="/blog" passHref>
            <Button variant="ghost" size="sm" className="pl-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to all posts
            </Button>
          </Link>
        </div>
        
        {/* Post header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{meta.title}</h1>
          
          {/* Post metadata */}
          <div className="flex flex-wrap gap-y-3 items-center text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{meta.formattedDate}</span>
            </div>
            <Separator orientation="vertical" className="mx-3 h-4" />
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{meta.readingTime}</span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {meta.tags.map((tag) => (
              <Link 
                href={`/blog?tag=${tag}`} 
                key={tag}
                passHref
              >
                <Badge variant="secondary" className="hover:bg-secondary/80">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
          
          <Separator className="mb-8" />
        </header>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Table of Contents - desktop */}
          <aside className="hidden lg:block w-64 h-fit sticky top-20">
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="font-medium mb-3 text-sm">Table of Contents</h3>
              <TableOfContents content={content} />
            </div>
          </aside>
          
          {/* Blog content */}
          <div className="flex-1 min-w-0 prose dark:prose-invert prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary max-w-none">
            <BlogContent content={content} />
          </div>
        </div>
        
        {/* Post navigation */}
        <div className="mt-16">
          <Separator className="mb-8" />
          
          <nav className="flex flex-col sm:flex-row justify-between gap-4">
            {previousPost ? (
              <Link href={`/blog/${previousPost.slug}`} passHref>
                <Button variant="outline" className="flex flex-col items-start py-6 h-auto w-full sm:w-auto">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Previous Post</span>
                  </div>
                  <span className="font-medium text-left">{previousPost.title}</span>
                </Button>
              </Link>
            ) : (
              <div></div>
            )}
            
            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`} passHref>
                <Button variant="outline" className="flex flex-col items-end py-6 h-auto w-full sm:w-auto">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span>Next Post</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                  <span className="font-medium text-right">{nextPost.title}</span>
                </Button>
              </Link>
            ) : (
              <div></div>
            )}
          </nav>
        </div>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostSlugs();
  
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);
  const { previousPost, nextPost } = getAdjacentPosts(slug);
  
  return {
    props: {
      post,
      previousPost,
      nextPost,
    },
  };
}; 