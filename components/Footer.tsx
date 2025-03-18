import Link from 'next/link';
import { Separator } from "@/components/ui/separator";
import { Mail, Linkedin } from "lucide-react";
import XLogo from './icons/XLogo';
import { useEffect, useState } from 'react';
import { VercelThemeToggle } from './VercelThemeToggle';

const Footer = () => {
  const [lastCommitDate, setLastCommitDate] = useState<string>('Loading...');

  useEffect(() => {
    const fetchLastCommitDate = async () => {
      try {
        const response = await fetch('/api/last-commit-date');
        const data = await response.json();
        setLastCommitDate(data.date);
      } catch (error) {
        console.error('Error fetching last commit date:', error);
        setLastCommitDate('Unknown date');
      }
    };

    fetchLastCommitDate();
  }, []);

  return (
    <footer className="w-full py-4">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg">
        <Separator className="bg-border/40 mb-4" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
          <div>
            <p className="text-xs text-muted-foreground/70">Published {lastCommitDate} · © Keyana Sapp</p>
            <p className="text-xs text-muted-foreground italic">If you want to improve, be content to be thought foolish and stupid</p>
          </div>
          
          <div className="flex flex-row justify-between md:justify-start w-full md:w-auto items-center">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground">Say hello:</span>
              
              <Link 
                href="mailto:hello@keyana.io" 
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                aria-label="Email"
              >
                <Mail size={14} />
              </Link>
              
              <Link 
                href="https://twitter.com/keyanasapp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                aria-label="Twitter/X"
              >
                <XLogo size={14} />
              </Link>
              
              <Link 
                href="https://linkedin.com/in/keyanasapp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
              </Link>
            </div>
            
            <div className="hidden md:block h-4 mx-5 border-l border-border/50"></div>
            
            <VercelThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 