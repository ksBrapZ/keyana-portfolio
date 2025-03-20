---
title: "Getting Started with Next.js"
date: "2024-05-15"
description: "A beginner's guide to setting up a Next.js project with TypeScript and Tailwind CSS."
tags: ["nextjs", "react", "typescript", "tutorial"]
---

# Getting Started with Next.js

Next.js is a powerful React framework that makes building modern web applications simple and efficient. In this post, I'll walk you through setting up a basic Next.js project with TypeScript and Tailwind CSS.

## What is Next.js?

Next.js is a React framework that provides:

- Server-side rendering and static site generation
- File-based routing
- API routes
- Built-in CSS and Sass support
- Fast refresh
- TypeScript support
- Image optimization
- And much more!

It's developed by Vercel and has become one of the most popular choices for building React applications.

## Prerequisites

Before we get started, make sure you have:

- Node.js (version 14 or later)
- npm or yarn installed

## Setting Up Your Project

### 1. Create a New Next.js Project

```bash
npx create-next-app my-nextjs-app
```

Or with TypeScript:

```bash
npx create-next-app@latest --typescript my-nextjs-app
```

### 2. Adding Tailwind CSS

If you want to use Tailwind CSS, you can add it to your project:

```bash
cd my-nextjs-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update your `tailwind.config.js` file:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Then create a `globals.css` file in your styles directory:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

And import it in your `_app.tsx` file:

```tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp;
```

## Creating Your First Page

Next.js uses a file-based routing system. To create a new page, simply add a file to the `pages` directory:

```tsx
// pages/about.tsx
import type { NextPage } from 'next';

const About: NextPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">About Page</h1>
      <p>This is the about page of my Next.js application.</p>
    </div>
  );
};

export default About;
```

## Starting the Development Server

Now that you've set up your project, you can start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to see your application running!

## Conclusion

In this post, we covered the basics of setting up a Next.js project with TypeScript and Tailwind CSS. Next.js is a powerful framework that makes it easy to build modern web applications with React.

In future posts, I'll dive deeper into more advanced Next.js features like API routes, static site generation, and deployment strategies. Stay tuned! 