import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const FocusSection = () => {
  return (
    <section className="mb-3">
      <h2 className="text-muted-foreground text-sm uppercase tracking-wider mb-1.5">Focus</h2>
      <Card className="bg-card/5 border-border/10">
        <CardContent className="pt-3">
          <div className="group">
            <h3 className="text-lg font-medium flex items-center">
              US Commercial Partnerships, 
              <a 
                href="https://www.palantir.com" 
                className="text-primary ml-2 group-hover:text-primary/80 transition-colors flex items-center" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i>Palantir</i>
                <ExternalLink size={14} className="ml-1 opacity-70" />
              </a>
            </h3>
            <p className="text-muted-foreground text-sm mt-1">Helping western enterprises dominate with the most powerful AI stack in the world.</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FocusSection; 