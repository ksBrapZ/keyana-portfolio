
# Blog Implementation PRD: Minimal Personal Website Blog

## Overview

This PRD outlines the implementation of a clean, minimal blog for your personal website using shadcn/ui components. The blog will use markdown files for content (exported from Bear) with no CMS requirement, maintaining your existing header and footer components for a seamless experience.

## Goals

- Create a beautiful, minimal blog that matches your existing site aesthetic
- Implement using shadcn/ui components for visual consistency
- Allow for easy content management via markdown files
- Maintain the existing header/footer structure
- Keep implementation clean and maintainable

## Technical Implementation

### 1. File Structure

```
/content
  /blog
    post-1.md
    post-2.md
    ...
/pages
  /blog
    index.tsx      # Blog listing page
    [slug].tsx     # Individual blog post page
/components
  /blog
    BlogCard.tsx   # Preview card for blog listing
    BlogContent.tsx # Rendered markdown content
```

### 2. Dependencies

Add the following dependencies to parse and render markdown:

- `gray-matter`: For parsing markdown frontmatter
- `react-markdown`: For rendering markdown to React components
- `next-mdx-remote` (optional): If you want to use MDX (markdown with React components)

### 3. Content Structure

Each markdown file should include frontmatter with metadata:

```markdown
---
title: "My First Blog Post"
date: "2023-08-15"
description: "A short description about this post"
tags: ["nextjs", "design"]
---

# Heading 1

Your content here...
```

### 4. Page Implementation

#### Blog Index Page

Create a blog listing page that:
- Fetches all markdown files 
- Extracts metadata from frontmatter
- Displays blog post cards in a grid or list
- Includes pagination if needed
- Uses shadcn/ui Card component for each post preview

#### Individual Blog Post Page

Create a dynamic route that:
- Fetches specific markdown file based on slug
- Renders markdown content with proper styling
- Includes metadata like publication date, reading time
- Provides navigation to previous/next posts
- Uses shadcn/ui components for UI elements

### 5. Styling Considerations

- Use shadcn/ui components for UI elements (Card, Button, etc.)
- Maintain your existing dark theme
- Create consistent typography for blog content
- Ensure responsive design for all screen sizes
- Add subtle animations for enhanced UX

## Implementation Approach

### Phase 1: Setup

1. Create the necessary directory structure
2. Install required dependencies
3. Set up markdown parsing utilities

### Phase 2: Blog Index

1. Create the blog index page
2. Implement markdown file discovery
3. Design and implement blog post cards
4. Add sorting and filtering capabilities

### Phase 3: Blog Post Pages

1. Create dynamic route for individual posts
2. Implement markdown rendering with proper styling
3. Add metadata display
4. Create previous/next post navigation

### Phase 4: Polish & Optimization

1. Add image optimization
2. Implement code syntax highlighting
3. Add reading time calculation
4. Ensure responsive design across devices

## Technical Details

### Markdown Processing

Use the following approach to process markdown files:

1. Use Node.js file system methods to read markdown files
2. Parse frontmatter with gray-matter
3. Render markdown content with react-markdown
4. Apply custom components to markdown elements for styling

### shadcn/ui Integration

Leverage the following shadcn/ui components:

- `Card`, `CardHeader`, `CardContent`, etc. for blog previews
- `Separator` for visual dividers
- `Button` for navigation controls
- `Badge` for tags/categories
- `Typography` components for consistent text styling

### Performance Considerations

- Use static generation (getStaticProps/getStaticPaths) for optimal performance
- Implement image optimization with Next.js Image component
- Consider incremental static regeneration if content updates frequently

## Example Code Patterns

### Reading Markdown Files

```typescript
// utils/mdx.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_PATH = path.join(process.cwd(), 'content/blog');

export function getAllPosts() {
  const files = fs.readdirSync(POSTS_PATH);
  
  return files.map(filename => {
    const filePath = path.join(POSTS_PATH, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    const slug = filename.replace('.md', '');
    
    return {
      slug,
      frontmatter: data,
      content
    };
  }).sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

export function getPostBySlug(slug) {
  const filePath = path.join(POSTS_PATH, `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  
  return {
    slug,
    frontmatter: data,
    content
  };
}
```