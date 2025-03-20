import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PostMeta } from '@/lib/blog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  post: PostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-md">
      <CardHeader className="pb-3">
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          <CardTitle className="line-clamp-2 text-xl hover:text-primary">
            {post.title}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">
          {post.formattedDate}
        </p>
      </CardHeader>
      
      <CardContent className="flex-grow pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start space-y-3 pt-0">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Link href={`/blog/${post.slug}`} passHref>
          <Button variant="ghost" size="sm" className="p-0 h-auto font-medium">
            Read more
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 