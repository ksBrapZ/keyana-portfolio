import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const Header = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

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
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Keyana's Info */}
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Keyana Sapp</h1>
            <p className="text-muted-foreground">Digital and analogue builder</p>
            <p className="text-sm text-muted-foreground/70">Boulder, CO · {currentTime}</p>
          </div>

          {/* Navigation Links and Theme Toggle */}
          <div className="flex items-center mt-4 md:mt-0">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/writing" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm uppercase tracking-wider px-4 py-2 hover:text-primary transition-colors">
                      Writing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/photos" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm uppercase tracking-wider px-4 py-2 hover:text-primary transition-colors">
                      Photos
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/toolkit" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm uppercase tracking-wider px-4 py-2 hover:text-primary transition-colors">
                      Toolkit
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <ThemeToggle />
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