import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import photos from '@/data/photos.json';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

// Group photos by location for the alphabetical view
interface PhotosByLocation {
  [location: string]: Photo;
}

interface TimelineProps {
  photosByYear: PhotosByYear;
  photosByLocation: PhotosByLocation;
  years: number[];
  totalLocations: number;
  locations: string[];
}

export default function GalleryTimeline({ photosByYear, photosByLocation, years, totalLocations, locations }: TimelineProps) {
  const router = useRouter();
  const [isColorMode, setIsColorMode] = useState(true);
  const [viewMode, setViewMode] = useState<'photo' | 'map'>('photo');
  const [displayMode, setDisplayMode] = useState<'years' | 'locations'>('years');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  
  // Flatten all images into a single array for global navigation
  const allImages = locations.reduce((acc, locationTitle) => {
    const location = photosByLocation[locationTitle];
    return [...acc, ...location.images.map(image => ({ 
      src: image, 
      location: locationTitle,
      alt: location.title
    }))];
  }, [] as { src: string; location: string; alt: string }[]);
  
  // Sort years in descending order (most recent first)
  const sortedYears = [...years].sort((a, b) => b - a);
  
  // Handle image click in location view
  const handleImageClick = (locationTitle: string, index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedLocation(locationTitle);
    
    // Find the absolute index in the allImages array
    const location = photosByLocation[locationTitle];
    let globalIndex = 0;
    
    for (const loc of locations) {
      if (loc === locationTitle) {
        globalIndex += index;
        break;
      } else {
        globalIndex += photosByLocation[loc].images.length;
      }
    }
    
    setSelectedImageIndex(globalIndex);
    setModalOpen(true);
  };
  
  // Handle next/previous image in modal
  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
    setSelectedLocation(allImages[(selectedImageIndex + 1) % allImages.length].location);
  };
  
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setSelectedLocation(allImages[(selectedImageIndex - 1 + allImages.length) % allImages.length].location);
  };
  
  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

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
              <div className="flex space-x-1 text-sm cursor-pointer">
                <button 
                  className={`${displayMode === 'years' ? 'font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setDisplayMode('years')}
                >
                  {years.length} years
                </button>
                <span className="text-muted-foreground">/</span>
                <button 
                  className={`${displayMode === 'locations' ? 'font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setDisplayMode('locations')}
                >
                  {totalLocations} locations
                </button>
              </div>
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

          {displayMode === 'years' ? (
            // Year-based timeline view
            <>
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
                            href={`/gallery/${location.year}/${location.locationSlug}`}
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
            </>
          ) : (
            // Alphabetical locations view
            <>
              {locations.map((locationTitle) => {
                const location = photosByLocation[locationTitle];
                
                return (
                  <div key={location.locationSlug} className="mb-20">
                    <div className="flex justify-between items-baseline mb-8">
                      <h2 className="text-4xl md:text-5xl font-light leading-none">{location.title}</h2>
                      <span className="text-2xl md:text-3xl text-muted-foreground font-light">
                        {location.images.length}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-8">
                      {location.images.map((image, index) => (
                        <a 
                          href="#"
                          onClick={(e) => handleImageClick(locationTitle, index, e)}
                          key={`${location.locationSlug}-${index}`}
                          className="block group cursor-pointer"
                        >
                          <div className="aspect-[4/3] relative overflow-hidden mb-1">
                            <Image
                              src={image}
                              alt={`${location.title} ${index + 1}`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                              className={`object-cover ${!isColorMode ? 'grayscale' : ''}`}
                              priority={index < 3}
                            />
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </main>

      {/* Image Modal */}
      {modalOpen && selectedLocation && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center text-white text-sm">
            <button 
              className="hover:text-gray-300"
              onClick={() => setModalOpen(false)}
            >
              back (esc)
            </button>
            
            <div className="flex space-x-4">
              <button 
                className="hover:text-gray-300"
                onClick={handlePrevImage}
              >
                prev &lt;
              </button>
              <button 
                className="hover:text-gray-300"
                onClick={handleNextImage}
              >
                next &gt;
              </button>
            </div>
            
            <div>
              {selectedImageIndex + 1} / {allImages.length}
            </div>
          </div>
          
          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={allImages[selectedImageIndex].src}
              alt={allImages[selectedImageIndex].alt}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

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

  // Group photos by location title
  const photosByLocation = photos.reduce((acc: PhotosByLocation, photo: Photo) => {
    acc[photo.title] = photo;
    return acc;
  }, {});

  // Get unique years
  const years = Object.keys(photosByYear).map(Number);
  
  // Get unique location titles and sort them alphabetically
  const locationsSet = new Set(photos.map(photo => photo.title));
  const locations = Array.from(locationsSet).sort();
  
  // Calculate total locations
  const totalLocations = photos.length;

  return {
    props: {
      photosByYear,
      photosByLocation,
      years,
      locations,
      totalLocations,
    },
  };
}; 