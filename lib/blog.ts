import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content/blog');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  description: string;
  tags: string[];
  readingTime: string;
};

export type Post = {
  meta: PostMeta;
  content: string;
};

/**
 * Calculate estimated reading time for a text
 * @param text The content to calculate reading time for
 * @param wordsPerMinute Average reading speed (default: 225 words per minute)
 * @returns Formatted reading time string
 */
export function calculateReadingTime(text: string, wordsPerMinute = 225): string {
  // Remove all HTML tags and markdown syntax
  const cleanText = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/#+\s+/g, '') // Remove markdown headings
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image references
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italics
    .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`.*?`/g, ''); // Remove inline code
  
  const words = cleanText.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes} min read`;
}

export function getPostBySlug(slug: string): Post {
  const filePath = path.join(POSTS_DIRECTORY, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents);
  
  const date = new Date(data.date);
  
  const meta: PostMeta = {
    slug,
    title: data.title || '',
    date: data.date || '',
    formattedDate: format(date, 'MMMM d, yyyy'),
    description: data.description || '',
    tags: data.tags || [],
    readingTime: calculateReadingTime(content),
  };

  return { 
    meta, 
    content 
  };
}

export function getAllPosts(): Post[] {
  // Get filenames under /content/blog
  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, '');
      
      // Get post data
      const post = getPostBySlug(slug);
      
      return post;
    })
    // Sort posts by date in descending order
    .sort((a, b) => (new Date(b.meta.date) > new Date(a.meta.date) ? 1 : -1));
    
  return allPosts;
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

/**
 * Get the previous and next posts relative to the current post
 * @param currentSlug The slug of the current post
 * @returns Object with previous and next post metadata
 */
export function getAdjacentPosts(currentSlug: string): { 
  previousPost: PostMeta | null; 
  nextPost: PostMeta | null; 
} {
  const allPosts = getAllPosts();
  const currentPostIndex = allPosts.findIndex(post => post.meta.slug === currentSlug);
  
  // If post not found or there's only one post
  if (currentPostIndex === -1 || allPosts.length < 2) {
    return { previousPost: null, nextPost: null };
  }
  
  // Get previous post (newer in date)
  const previousPost = currentPostIndex > 0 
    ? allPosts[currentPostIndex - 1].meta 
    : null;
  
  // Get next post (older in date)
  const nextPost = currentPostIndex < allPosts.length - 1 
    ? allPosts[currentPostIndex + 1].meta 
    : null;
  
  return { previousPost, nextPost };
} 