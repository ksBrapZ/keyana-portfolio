import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PastItemProps {
  title: string;
  company: string;
  companyUrl?: string;
  description: string;
}

const PastItem = ({ title, company, companyUrl, description }: PastItemProps) => (
  <div className="group">
    <h3 className="text-base font-medium flex items-center">
      {title}, 
      {companyUrl ? (
        <a 
          href={companyUrl} 
          className="text-primary ml-2 group-hover:text-primary/80 transition-colors flex items-center" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <i>{company}</i>
          <ExternalLink size={12} className="ml-1 opacity-70" />
        </a>
      ) : (
        <span className="ml-2"><i>{company}</i></span>
      )}
    </h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

const PastSection = () => {
  return (
    <section>
      <h2 className="text-muted-foreground text-sm uppercase tracking-wider mb-1.5">Past</h2>
      <Card className="bg-card/5 border-border/10">
        <CardContent className="pt-3">
          <div className="space-y-1.5">
            <PastItem 
              title="Co-Founder & CEO"
              company="Indigo"
              companyUrl="https://getindigo.ai"
              description="The ultimate AI productivity suite for cracked teams. All-in-one platform for startups to build commands, assistants and agents."
            />
            
            <Separator className="bg-border/10 dark:bg-border/5" />
            
            <PastItem 
              title="Co-Founder"
              company="ShopSwap"
              companyUrl="https://www.shopswap.com"
              description="Collaborative growth network for DTC brands. 600+ brands in the network."
            />
            
            <Separator className="bg-border/10 dark:bg-border/5" />
            
            <PastItem 
              title="Partnership Lead"
              company="AppSumo"
              companyUrl="https://www.appsumo.com"
              description="Groupon for software. Launched 50+ apps to network of 1.5M entrepreneurs"
            />
            
            <Separator className="bg-border/10 dark:bg-border/5" />
            
            <PastItem 
              title="Event Lead"
              company="OpenRoom"
              companyUrl="https://www.openroomevents.com"
              description="B2B Forums for Dentists, Vets and Pharmacists. Launched APAC region's 1st veterinary trade show"
            />
            
            <Separator className="bg-border/10 dark:bg-border/5" />
            
            <PastItem 
              title="PhD dropout"
              company="Philosophy"
              description="Funding fell through before my 1st year. Entered the workforce instead. Thank god."
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PastSection; 