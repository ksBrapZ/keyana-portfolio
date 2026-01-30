import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Github } from "lucide-react";

const Header = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const showBackButton = pathname !== '/';

  useEffect(() => {
    // Update time based on MST timezone
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Denver'
      };
      setCurrentTime(new Date().toLocaleTimeString('en-US', options) + ' MST');
    };

    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full pt-4 pb-3 bg-background">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-row justify-between items-center w-full">
            {/* Keyana's Info - name and tagline link to home */}
            <div>
              <Link
                href="/"
                className="block hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                aria-label="Keyana Sapp – back to home"
              >
                <h1 className="text-2xl font-medium tracking-tight">Keyana Sapp</h1>
                <p className="text-muted-foreground">Restoring tangible competence in a disposable world</p>
              </Link>
              <p className="text-sm text-muted-foreground/70">Boulder, CO · {currentTime}</p>
            </div>

            <div className="flex items-center">
              {/* Back Button for all screen sizes - positioned right of header info */}
              {showBackButton && (
                <div className="flex items-center mr-2">
                  <Link href="/" passHref>
                    <Button variant="ghost" size="icon" aria-label="Back to Home">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              )}
              
              {/* Mobile Menu Button - only visible on small screens */}
              <div className="md:hidden relative z-50">
                <Button
                  className="group"
                  variant="outline"
                  size="icon"
                  onClick={() => setMobileMenuOpen((prevState) => !prevState)}
                  aria-expanded={mobileMenuOpen}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <svg
                    className="pointer-events-none"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L20 12"
                      className="origin-center -translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    />
                  </svg>
                </Button>
              </div>
              
              {/* Desktop Navigation - hidden on small screens */}
              <div className="hidden md:flex items-center">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/blog" legacyBehavior passHref>
                        <NavigationMenuLink 
                          className={cn(
                            "text-sm uppercase tracking-wider px-4 py-2 hover:text-primary transition-colors",
                            pathname === "/blog" || pathname?.startsWith("/blog/") ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          Blog
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/toolkit" legacyBehavior passHref>
                        <NavigationMenuLink 
                          className={cn(
                            "text-sm uppercase tracking-wider px-4 py-2 hover:text-primary transition-colors",
                            pathname === "/toolkit" || pathname?.startsWith("/toolkit/") ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          Toolkit
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/gallery" legacyBehavior passHref>
                        <NavigationMenuLink 
                          className={cn(
                            "text-sm uppercase tracking-wider px-4 py-2 hover:text-primary transition-colors",
                            pathname === "/gallery" || pathname?.startsWith("/gallery/") ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          Gallery
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu dropdown - only visible when open and on small screens */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop with blur effect */}
          <div 
            className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Floating menu */}
          <div className="md:hidden fixed top-24 right-6 w-1/2 py-4 px-5 bg-background border border-border/30 rounded-md shadow-sm z-50">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/blog" 
                className={cn(
                  "text-sm uppercase tracking-wider py-2 hover:text-primary transition-colors",
                  pathname === "/blog" || pathname?.startsWith("/blog/") ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/toolkit" 
                className={cn(
                  "text-sm uppercase tracking-wider py-2 hover:text-primary transition-colors",
                  pathname === "/toolkit" || pathname?.startsWith("/toolkit/") ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Toolkit
              </Link>
              <Link 
                href="/gallery" 
                className={cn(
                  "text-sm uppercase tracking-wider py-2 hover:text-primary transition-colors",
                  pathname === "/gallery" || pathname?.startsWith("/gallery/") ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>
            </nav>
          </div>
        </>
      )}
      
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg mt-3">
        <Separator className="bg-border/40" />
      </div>
    </header>
  );
};

export default Header;