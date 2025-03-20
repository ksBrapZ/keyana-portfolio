import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getPostBySlug, getPostSlugs, BlogPost } from '@/lib/blog';
import BlogContent from '@/components/blog/BlogContent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';

interface BlogPostPageProps {
  post: BlogPost | null;
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
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
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg py-8">
          <BlogContent frontmatter={frontmatter} content={content} />
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
  
  return {
    props: {
      post,
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