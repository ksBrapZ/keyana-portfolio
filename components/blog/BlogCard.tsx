import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate, calculateReadingTime } from '@/lib/blog';
import type { PostFrontmatter } from '@/lib/blog';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
}

export default function BlogCard({ slug, frontmatter, content }: BlogCardProps) {
  const { title, date, description, tags } = frontmatter;
  const formattedDate = formatDate(date);
  const readingTime = calculateReadingTime(content);

  return (
    <Link href={`/blog/${slug}`} className="block">
      <Card className="h-full rounded-xl border border-border/50 dark:border-border/20 bg-card/5 transition-all duration-200 hover:bg-accent/15 dark:hover:bg-primary/5 hover:border-primary/20 dark:hover:border-primary/20">
        <CardHeader className="pb-2">
          <div className="text-xs text-muted-foreground mb-1">
            {formattedDate} · {readingTime} min read
          </div>
          <h2 className="text-xl font-medium">{title}</h2>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
} 