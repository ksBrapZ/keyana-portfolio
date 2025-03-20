import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { getAllPosts, PostMeta } from '@/lib/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface BlogIndexProps {
  posts: PostMeta[];
  allTags: string[];
}

export default function BlogIndex({ posts, allTags }: BlogIndexProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filter posts by selected tag
  const filteredPosts = selectedTag 
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  // Sort posts by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'newest' 
      ? dateB.getTime() - dateA.getTime() 
      : dateA.getTime() - dateB.getTime();
  });

  return (
    <>
      <Head>
        <title>Blog | Keyana Sapp</title>
        <meta name="description" content="Explore my thoughts, projects, and insights on technology, design, and development." />
      </Head>
      
      <div className="container max-w-5xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts, ideas, and insights on technology, design, and my journey as a developer.
          </p>
        </div>
        
        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Filter by tag:</span>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedTag === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Badge>
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Sort:</span>
            <Select 
              value={sortOrder} 
              onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest')}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Post Count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {sortedPosts.length} {sortedPosts.length === 1 ? 'post' : 'posts'}
          {selectedTag ? ` tagged with "${selectedTag}"` : ''}
        </p>
        
        {/* Blog Posts Grid */}
        {sortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found with the selected filter.</p>
            {selectedTag && (
              <Button 
                variant="ghost" 
                className="mt-4" 
                onClick={() => setSelectedTag(null)}
              >
                Clear filter
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts().map(post => post.meta);
  
  // Extract all unique tags
  const allTags = Array.from(
    new Set(
      posts.flatMap(post => post.tags)
    )
  ).sort();
  
  return {
    props: {
      posts,
      allTags,
    },
  };
}; 