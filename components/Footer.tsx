import Link from 'next/link';
import { Separator } from "@/components/ui/separator";
import { Mail, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-4">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg">
        <Separator className="bg-border/40 mb-4" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
          <div>
            <p className="text-xs text-muted-foreground/70">Published 2/26/2025 · © Keyana Sapp</p>
            <p className="text-xs text-muted-foreground italic">If you want to improve, be content to be thought foolish and stupid</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-xs text-muted-foreground">Say hello:</span>
            
            <Link 
              href="mailto:hello@keyana.io" 
              className="text-muted-foreground hover:text-primary transition-colors p-1"
              aria-label="Email"
            >
              <Mail size={16} />
            </Link>
            
            <Link 
              href="https://twitter.com/keyanasapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-1"
              aria-label="Twitter/X"
            >
              <Twitter size={16} />
            </Link>
            
            <Link 
              href="https://linkedin.com/in/keyanasapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-1"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 