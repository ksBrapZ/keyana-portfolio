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
    <header className="w-full pt-6 pb-4">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Removed the large screen back button implementation */}
          
          <div className="flex flex-row justify-between items-center w-full">
            {/* Keyana's Info */}
            <div>
              <h1 className="text-2xl font-medium tracking-tight">Keyana Sapp</h1>
              <p className="text-muted-foreground">Digital and analogue builder</p>
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
              
              {/* Navigation Links and Theme Toggle - fixed position at all breakpoints */}
              <div className="flex items-center">
                <NavigationMenu>
                  <NavigationMenuList>
                    {pathname !== "/toolkit" && (
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
                    )}
                    
                    {/* Blog link - now active */}
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
                    
                    {/* Temporarily hidden until photo gallery is set up
                    <NavigationMenuItem>
                      <Link href="/photos" legacyBehavior passHref>
                        <NavigationMenuLink className="text-sm uppercase tracking-wider px-4 py-2 hover:text-primary transition-colors">
                          Photos
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    */}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg mt-4">
        <Separator className="bg-border/40" />
      </div>
    </header>
  );
};

export default Header;