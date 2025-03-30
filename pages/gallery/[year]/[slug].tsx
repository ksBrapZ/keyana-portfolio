import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import photos from '@/data/photos.json';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';

// Define the Photo interface based on our JSON structure
interface Photo {
  year: number;
  locationSlug: string;
  title: string;
  description: string;
  camera: string;
  lens: string;
  coordinates?: string;
  images: string[];
}

interface LocationDetailProps {
  location: Photo;
  prevLocation: { year: number; slug: string; title: string } | null;
  nextLocation: { year: number; slug: string; title: string } | null;
}

export default function LocationDetail({ 
  location, 
  prevLocation, 
  nextLocation 
}: LocationDetailProps) {
  const router = useRouter();
  const [isColorMode, setIsColorMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle keyboard navigation when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      if (e.key === 'ArrowLeft' || e.key === '<') {
        setCurrentImageIndex((prev) => 
          prev === 0 ? location.images.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight' || e.key === '>') {
        setCurrentImageIndex((prev) => 
          prev === location.images.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, location.images.length]);

  // Function to open the modal with a specific image
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-light">
      <Head>
        <title>{location.title} | Gallery | Keyana Sapp</title>
        <meta name="description" content={`Photos of ${location.title} by Keyana Sapp`} />
      </Head>
      
      {!isModalOpen && <Header />}

      <main className={`py-3 flex-1 ${isModalOpen ? 'hidden' : ''}`}>
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Link href="/gallery" className="text-sm hover:underline">
                back <span className="text-muted-foreground">(esc)</span>
              </Link>
            </div>
            
            <div className="flex text-xs space-x-6">
              <div className="flex space-x-1">
                <button 
                  className={`${isColorMode ? 'font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setIsColorMode(true)}
                >
                  color
                </button>
                <span className="text-muted-foreground">/</span>
                <button 
                  className={`${!isColorMode ? 'font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setIsColorMode(false)}
                >
                  b & w
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-medium">{location.title}</h1>
              {location.coordinates && (
                <p className="text-xs text-muted-foreground/50 font-light tracking-wide">
                  {location.coordinates}
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {location.description}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              {location.camera && `${location.camera}`}{location.lens && ` • ${location.lens}`}
            </p>
          </div>

          {/* Image Grid with numbers */}
          <div className="grid grid-cols-6 gap-2">
            {location.images.map((image, index) => (
              <div 
                key={image} 
                className={`relative cursor-pointer group ${index < 6 ? 'col-span-3 sm:col-span-2' : 'col-span-2'}`}
                onClick={() => openModal(index)}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={image}
                    alt={`${location.title} - Image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className={`object-cover ${!isColorMode ? 'grayscale' : ''}`}
                  />
                </div>
                <div className="absolute top-0 left-0 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded-br">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation between locations */}
          <div className="mt-12 flex justify-between text-xs">
            <div>
              {prevLocation && (
                <Link 
                  href={`/gallery/${prevLocation.year}/${prevLocation.slug}`}
                  className="hover:underline flex items-center space-x-1 text-muted-foreground"
                >
                  <span>prev</span> <span className="text-muted-foreground/50">&lt;</span>
                </Link>
              )}
            </div>
            <div>
              {nextLocation && (
                <Link 
                  href={`/gallery/${nextLocation.year}/${nextLocation.slug}`}
                  className="hover:underline flex items-center space-x-1 text-muted-foreground"
                >
                  <span>next</span> <span className="text-muted-foreground/50">&gt;</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {!isModalOpen && <Footer />}

      {/* Image Modal/Lightbox */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black z-50 flex flex-col"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="py-4 px-6 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
                className="text-sm hover:underline"
              >
                back <span className="text-gray-500">(esc)</span>
              </button>
            </div>
            
            <div className="text-xs flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => prev === 0 ? location.images.length - 1 : prev - 1);
                }}
                className="text-gray-400 hover:text-white"
              >
                prev <span className="text-gray-600">&lt;</span>
              </button>
              <span className="text-gray-500">|</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => prev === location.images.length - 1 ? 0 : prev + 1);
                }}
                className="text-gray-400 hover:text-white"
              >
                next <span className="text-gray-600">&gt;</span>
              </button>
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-4">{currentImageIndex + 1} / {location.images.length}</span>
              {location.coordinates && (
                <span className="font-light tracking-wide">{location.coordinates}</span>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-full">
              <Image
                src={location.images[currentImageIndex]}
                alt={`${location.title} - Image ${currentImageIndex + 1}`}
                fill
                sizes="100vw"
                className={`object-contain ${!isColorMode ? 'grayscale' : ''}`}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = photos.map((photo: Photo) => ({
    params: { year: photo.year.toString(), slug: photo.locationSlug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const year = params?.year as string;
  const slug = params?.slug as string;

  // Find the current location
  const location = photos.find(
    (photo: Photo) => photo.year.toString() === year && photo.locationSlug === slug
  );

  if (!location) {
    return {
      notFound: true,
    };
  }

  // Get all locations sorted by year (newest first) then by title
  const allLocations = [...photos].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return a.title.localeCompare(b.title);
  });

  // Find the index of the current location
  const currentIndex = allLocations.findIndex(
    (photo) => photo.year === parseInt(year) && photo.locationSlug === slug
  );

  // Find prev and next locations
  const prevLocation = currentIndex > 0 
    ? {
        year: allLocations[currentIndex - 1].year,
        slug: allLocations[currentIndex - 1].locationSlug,
        title: allLocations[currentIndex - 1].title,
      }
    : null;

  const nextLocation = currentIndex < allLocations.length - 1
    ? {
        year: allLocations[currentIndex + 1].year,
        slug: allLocations[currentIndex + 1].locationSlug,
        title: allLocations[currentIndex + 1].title,
      }
    : null;

  return {
    props: {
      location,
      prevLocation,
      nextLocation,
    },
  };
}; 