import Head from 'next/head';
import { useRouter } from 'next/router';
import { PostMeta } from '@/lib/blog';
import { BlogPosting } from 'schema-dts';

interface BlogSEOProps {
  post: PostMeta;
  siteUrl?: string;
  siteTitle?: string;
  authorName?: string;
}

export function BlogSEO({ 
  post, 
  siteUrl = 'https://keyanasapp.com', 
  siteTitle = 'Keyana Sapp', 
  authorName = 'Keyana Sapp' 
}: BlogSEOProps) {
  const router = useRouter();
  const canonicalUrl = `${siteUrl}${router.pathname}`;
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&date=${encodeURIComponent(post.formattedDate)}`;
  
  // Create JSON-LD structured data for the blog post
  const jsonLd: BlogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteTitle,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    keywords: post.tags.join(', '),
  };

  return (
    <Head>
      <title>{post.title} | {siteTitle}</title>
      <meta name="description" content={post.description} />
      
      {/* Canonical link */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* OpenGraph tags */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="article:published_time" content={post.date} />
      {post.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.description} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
} 