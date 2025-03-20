import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';

const POSTS_PATH = path.join(process.cwd(), 'content/blog');

export type PostFrontmatter = {
  title: string;
  date: string;
  description: string;
  tags: string[];
  published?: boolean;
};

export type BlogPost = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
};

export function getAllPosts(): BlogPost[] {
  try {
    const files = readdirSync(POSTS_PATH);
    
    return files
      .filter(filename => filename.endsWith('.md'))
      .map(filename => {
        const filePath = path.join(POSTS_PATH, filename);
        const fileContent = readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        const slug = filename.replace('.md', '');
        
        return {
          slug,
          frontmatter: data as PostFrontmatter,
          content
        };
      })
      .filter(post => process.env.NODE_ENV === 'development' || post.frontmatter.published !== false)
      .sort((a, b) => 
        new Date(b.frontmatter.date).getTime() - 
        new Date(a.frontmatter.date).getTime()
      );
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const filePath = path.join(POSTS_PATH, `${slug}.md`);
    const fileContent = readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    return {
      slug,
      frontmatter: data as PostFrontmatter,
      content
    };
  } catch (error) {
    console.error(`Error getting post with slug ${slug}:`, error);
    return null;
  }
}

export function getPostSlugs(): string[] {
  try {
    const files = readdirSync(POSTS_PATH);
    
    return files
      .filter(filename => filename.endsWith('.md'))
      .map(filename => filename.replace('.md', ''));
  } catch (error) {
    console.error('Error getting post slugs:', error);
    return [];
  }
}

export function formatDate(date: string): string {
  const dateObj = new Date(date);
  return format(dateObj, 'MMMM d, yyyy');
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 225;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
} 