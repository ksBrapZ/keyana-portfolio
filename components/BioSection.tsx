import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BioSection = () => {
  return (
    <section>
      <h2 className="text-muted-foreground text-sm uppercase tracking-wider mb-2">Bio</h2>
      <Card className="bg-card/5 border-border/10">
        <CardContent className="pt-4">
          <div className="text-card-foreground/90 text-sm leading-relaxed space-y-3">
            <p>
              My life has always been guided by curiosity - a drive to explore how things work, why they matter, and how they can be improved.</p>
            <p>
              I was raised between cultures, with an Iranian mother and an American father in London, England. This multicultural upbringing deeply enriched my perspective, instilling a profound appreciation for diverse ideas, traditions, and worldviews.            </p>
            <p>
              Im fascinated by systems - testing their limits and understanding their intricacies. Whether it's building startups, tuning motorcycles, or planning mountain adventures, <em>I'm fascinated by the interplay between technology, craftsmanship, and nature.</em>  </p>
            <p>  I believe there's a quiet path to happiness in creating things with intention, taking thoughtful risks, and focussing solely on what is in our power to affect.            </p>
            <p>
              <span className="font-semibold">Above all, my deepest joy comes from my (currently small) family - my ultimate guiding light.</span>            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default BioSection;