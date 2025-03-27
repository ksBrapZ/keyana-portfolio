import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
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
  const [viewMode, setViewMode] = useState<'photo' | 'map'>('photo');
  
  // Sort years in descending order (most recent first)
  const sortedYears = [...years].sort((a, b) => b - a);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-light">
      <Head>
        <title>Gallery | Keyana Sapp</title>
        <meta name="description" content="Photo gallery by Keyana Sapp" />
      </Head>
      
      <Header />
      
      <main className="py-3 flex-1">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{years.length} years / {totalLocations} locations</span>
            </div>
            
            <div className="flex text-xs space-x-6">
              <div className="flex space-x-1">
                <button 
                  className={`${viewMode === 'photo' ? 'font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setViewMode('photo')}
                >
                  photo
                </button>
                <span className="text-muted-foreground">/</span>
                <button 
                  className={`${viewMode === 'map' ? 'font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setViewMode('map')}
                >
                  map
                </button>
              </div>
              
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

          {sortedYears.map((year) => {
            const locationsInYear = photosByYear[year];
            
            return (
              <div key={year} className="mb-20">
                <div className="flex justify-between items-baseline mb-8">
                  <h2 className="text-4xl md:text-5xl font-light leading-none">{year}</h2>
                  <span className="text-2xl md:text-3xl text-muted-foreground font-light">
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
                          <span>{location.title}</span>
                          <span className="text-muted-foreground">{location.images.length}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
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