import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getPostBySlug, getPostSlugs, BlogPost, getAllPosts } from '@/lib/blog';
import BlogContent from '@/components/blog/BlogContent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import BlogPostNavigation from '../../components/blog/BlogPostNavigation';

interface BlogPostPageProps {
  post: BlogPost | null;
  nextPost: BlogPost | null;
  prevPost: BlogPost | null;
}

export default function BlogPostPage({ post, nextPost, prevPost }: BlogPostPageProps) {
  const router = useRouter();
  
  // Handle the case where the post is not found
  if (!post) {
    if (!router.isFallback) {
      router.push('/blog');
    }
    return <div>Loading...</div>;
  }
  
  const { frontmatter, content } = post;
  
  return (
    <>
      <Head>
        <title>{frontmatter.title} | Keyana Sapp</title>
        <meta name="description" content={frontmatter.description} />
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:description" content={frontmatter.description} />
        <meta name="twitter:title" content={frontmatter.title} />
        <meta name="twitter:description" content={frontmatter.description} />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        
        <main className="flex-grow container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg py-6">
          <BlogContent frontmatter={frontmatter} content={content} />
          
          <div className="mt-16">
            <BlogPostNavigation nextPost={nextPost} prevPost={prevPost} />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      notFound: true,
    };
  }
  
  // Get all posts and find the current post index
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  
  // Get next and previous posts
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  
  return {
    props: {
      post,
      nextPost,
      prevPost,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getPostSlugs();
  
  return {
    paths: slugs.map((slug) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  };
}; 