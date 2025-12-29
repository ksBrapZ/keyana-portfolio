import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BioSection = () => {
  return (
    <section>
      <h2 className="text-muted-foreground text-sm uppercase tracking-wider mb-1.5">Bio</h2>
      <Card className="bg-card/5 border-border/10">
        <CardContent className="pt-3">
          <div className="text-card-foreground/90 text-sm leading-relaxed space-y-2">
            <p><strong>My life has always been guided by curiosity - a relentless drive to explore how things work, <em>why they matter</em>, and <em>how they can be improved</em>.</strong></p>

            <p>I was raised between cultures, with an Iranian mother and an American father in London, England. Spending my teens and early twenties traveling widely taught me to appreciate the <em>richness and diversity</em> of people everywhere. In 2021, I moved to America to build the next chapter of my life.</p>

            <p>My multicultural upbringing sparked my fascination with systems - both physical and digital. From software applications to motorcycles, I've always been drawn to understanding the underlying mechanics of things: how they operate, why they fail, and <strong>what makes them last</strong>. As systems grow more complex and skills more specialized, I believe there's profound value in <em>returning to basic principles</em>, connecting deeply with the fundamentals.</p>

            <p>For me, happiness lies in creating intentionally, taking thoughtful risks, and building things that endure. Above all, though, my deepest joy is found in family - my <strong><em>small but growing guiding light</em></strong>.</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default BioSection;