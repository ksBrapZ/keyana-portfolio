import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const FocusSection = () => {
  return (
    <section className="mb-4">
      <h2 className="text-muted-foreground text-sm uppercase tracking-wider mb-2">Focus</h2>
      <Card className="bg-card/5 border-border/10">
        <CardContent className="pt-4">
          <div className="group">
            <h3 className="text-lg font-medium flex items-center">
              Co-Founder & CEO, 
              <a 
                href="https://getindigo.ai" 
                className="text-primary ml-2 group-hover:text-primary/80 transition-colors flex items-center" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i>Indigo</i>
                <ExternalLink size={14} className="ml-1 opacity-70" />
              </a>
            </h3>
            <p className="text-card-foreground/90 italic text-sm">The ultimate AI productivity suite for cracked teams.</p>
            <p className="text-muted-foreground text-sm mt-1">All-in-one platform for startups to build commands, assistants and agents on top of their existing data.</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FocusSection; 