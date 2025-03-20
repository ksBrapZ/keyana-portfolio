import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getAllPosts, BlogPost } from '@/lib/blog';
import BlogCard from '@/components/blog/BlogCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

interface BlogIndexProps {
  posts: BlogPost[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <>
      <Head>
        <title>Blog | Keyana Sapp</title>
        <meta name="description" content="Thoughts and writings by Keyana Sapp" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Blog</h1>
            <p className="text-muted-foreground">Thoughts and writings on design, development, and more.</p>
          </div>
          
          <Separator className="mb-8 bg-border/40" />
          
          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {posts.map((post) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No posts yet. Check back soon!</p>
          )}
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