// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'res.cloudinary.com',
      'imgur.com',
      'i.imgur.com',
      'cdn.pixabay.com',
      'picsum.photos',
    ],
  },
}

module.exports = nextConfig