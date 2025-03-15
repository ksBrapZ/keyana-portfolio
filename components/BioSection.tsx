import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BioSection = () => {
  return (
    <section>
      <h2 className="text-muted-foreground text-sm uppercase tracking-wider mb-2">Bio</h2>
      <Card className="bg-card/5 border-border/10">
        <CardContent className="pt-4">
          <div className="text-card-foreground/90 text-sm leading-relaxed space-y-3">
            <p>
              My life has always been guided by curiosity - a drive to explore how things work, why they matter, and how they can be improved. 
              <br />
              <br />
              Raised between cultures, by an Iranian mother and American father, I've learned that meaningful connections often come from blending perspectives.
            </p>
            <p>
              Whether it's building startups that help small businesses harness AI, tuning my Suzuki DR650, or seeking clarity in mountain adventures, <em>I'm fascinated by the interplay between technology, craftsmanship, and nature.</em> 
              <br />
              <br />
              I believe there's a quiet philosophy in creating things with intention, taking thoughtful risks, and embracing hands-on experiences.
            </p>
            <p>
              <span className="font-semibold">Above all, my deepest joy comes from my (currently small) family - the ultimate reminder of what's truly valuable.</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default BioSection; 