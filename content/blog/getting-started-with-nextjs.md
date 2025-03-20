---
title: "Getting Started with Next.js and TypeScript"
date: "2023-08-20"
description: "A beginner's guide to setting up a modern web application with Next.js and TypeScript."
tags: ["nextjs", "typescript", "tutorial"]
published: true
---

# Getting Started with Next.js and TypeScript

Next.js has become one of the most popular React frameworks for building modern web applications. Paired with TypeScript, it provides a powerful and type-safe development experience. In this post, I'll walk through setting up a new Next.js project with TypeScript.

## Prerequisites

Before we begin, make sure you have the following installed:

- Node.js (v14 or later)
- npm or yarn

## Creating a New Project

The easiest way to get started with Next.js is by using the `create-next-app` command:

```bash
npx create-next-app@latest my-app --typescript
# or
yarn create next-app my-app --typescript
```

This command creates a new Next.js project with TypeScript configuration already set up.

## Project Structure

After creating your project, you'll see a directory structure similar to this:

```
my-app/
├── .next/
├── node_modules/
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── api/
│   └── index.tsx
├── public/
├── styles/
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── next-env.d.ts
├── package.json
├── README.md
├── tsconfig.json
└── yarn.lock
```

## Adding a Component

Let's create a simple component to demonstrate TypeScript with React:

```tsx
// components/Greeting.tsx
interface GreetingProps {
  name: string;
}

export default function Greeting({ name }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Welcome to Next.js with TypeScript.</p>
    </div>
  );
}
```

## Using the Component

Now we can use this component in our home page:

```tsx
// pages/index.tsx
import Greeting from '../components/Greeting';

export default function Home() {
  return (
    <div>
      <Greeting name="Developer" />
    </div>
  );
}
```

## Running the Development Server

To start the development server, run:

```bash
npm run dev
# or
yarn dev
```

Your application should now be running at `http://localhost:3000`.

## Conclusion

This is just the beginning of what you can do with Next.js and TypeScript. In future posts, I'll explore more advanced topics like API routes, server-side rendering, and integrating with various UI libraries.

Happy coding! 