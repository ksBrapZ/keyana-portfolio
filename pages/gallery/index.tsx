import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import photos from '@/data/photos.json';

// Define the Photo interface based on our JSON structure
interface Photo {
  year: number;
  locationSlug: string;
  title: string;
  description: string;
  camera: string;
  lens: string;
  images: string[];
}

// Group photos by year for the timeline view
interface PhotosByYear {
  [year: number]: Photo[];
}

interface TimelineProps {
  photosByYear: PhotosByYear;
  years: number[];
  totalLocations: number;
}

export default function GalleryTimeline({ photosByYear, years, totalLocations }: TimelineProps) {
  const router = useRouter();
  const [isColorMode, setIsColorMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [viewMode, setViewMode] = useState<'photo' | 'map'>('photo');
  
  // Sort years in descending order (most recent first)
  const sortedYears = [...years].sort((a, b) => b - a);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <header className="py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-sm font-light">
            archive
          </Link>
          <span className="text-xs text-gray-500">{years.length} years / {totalLocations} locations</span>
        </div>
        
        <div className="flex text-xs space-x-6">
          <div className="flex space-x-1">
            <button 
              className={`${viewMode === 'photo' ? 'font-medium' : 'text-gray-500'}`}
              onClick={() => setViewMode('photo')}
            >
              photo
            </button>
            <span className="text-gray-500">/</span>
            <button 
              className={`${viewMode === 'map' ? 'font-medium' : 'text-gray-500'}`}
              onClick={() => setViewMode('map')}
            >
              map
            </button>
          </div>
          
          <div className="flex space-x-1">
            <button 
              className={`${!isDarkMode ? 'font-medium' : 'text-gray-500'}`}
              onClick={() => setIsDarkMode(false)}
            >
              light
            </button>
            <span className="text-gray-500">/</span>
            <button 
              className={`${isDarkMode ? 'font-medium' : 'text-gray-500'}`}
              onClick={() => setIsDarkMode(true)}
            >
              dark
            </button>
          </div>
          
          <div className="flex space-x-1">
            <button 
              className={`${isColorMode ? 'font-medium' : 'text-gray-500'}`}
              onClick={() => setIsColorMode(true)}
            >
              color
            </button>
            <span className="text-gray-500">/</span>
            <button 
              className={`${!isColorMode ? 'font-medium' : 'text-gray-500'}`}
              onClick={() => setIsColorMode(false)}
            >
              b & w
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 py-12">
        {sortedYears.map((year) => {
          const locationsInYear = photosByYear[year];
          const totalPhotosInYear = locationsInYear.reduce((total, location) => total + location.images.length, 0);
          
          return (
            <div key={year} className="mb-20">
              <div className="flex justify-between items-baseline mb-8">
                <h2 className="text-[12vw] md:text-[8vw] font-light leading-none">{year}</h2>
                <span className="text-[8vw] md:text-[6vw] text-gray-700 dark:text-gray-600 font-light">
                  {locationsInYear.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-8">
                {locationsInYear.map((location) => {
                  // Use the first image as the cover image
                  const coverImage = location.images[0];
                  
                  return (
                    <Link 
                      href={`/gallery/${year}/${location.locationSlug}`}
                      key={location.locationSlug}
                      className="block group"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden mb-1">
                        <Image
                          src={coverImage}
                          alt={location.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          className={`object-cover ${!isColorMode ? 'grayscale' : ''}`}
                          priority
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-gray-300">{location.title}</span>
                        <span className="text-gray-500">{location.images.length}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Group photos by year
  const photosByYear = photos.reduce((acc: PhotosByYear, photo: Photo) => {
    if (!acc[photo.year]) {
      acc[photo.year] = [];
    }
    acc[photo.year].push(photo);
    return acc;
  }, {});

  // Get unique years
  const years = Object.keys(photosByYear).map(Number);
  
  // Calculate total locations
  const totalLocations = photos.length;

  return {
    props: {
      photosByYear,
      years,
      totalLocations,
    },
  };
}; 