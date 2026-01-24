import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BioSection = () => {
  return (
    <section>
      <h2 className="text-muted-foreground text-sm uppercase tracking-wider mb-1.5">Bio</h2>
      <Card className="bg-card/5 border-border/10">
        <CardContent className="pt-3">
          <div className="text-card-foreground/90 text-sm leading-relaxed space-y-2">
            <p><strong>I sit at the intersection of the abstract and the concrete</strong>, drawn to both philosophy and mechanics, strategic thinking and calculated risk. I have always been obsessed with understanding what makes things actually work.</p>

            <p>I was raised between cultures, with an Iranian mother and an American father in London. My multicultural upbringing sparked a fascination with systems: why people believe what they believe, how things break, and what it takes to fix them properly. In 2021, I moved to America to build the next chapter.</p>

            <p>I have a Masters in philosophy – ethics, evolutionary psychology, the question of human flourishing. But I've never been content with theory alone. I've rebuilt motorcycles, climbed mountains, founded companies, played poker seriously, and learned that real understanding comes from having skin in the game.</p>

            <p>Modern life is increasingly abstract; digital work, disposable goods, infinite optimization without tangible proof of competence. I write about restoring that connection: the philosophy of maintenance, the architecture of risk, and why responsibility,cures the crisis of meaning.</p>

            <p>My deepest joy is found in family –<strong> my small but growing guiding light.</strong></p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default BioSection;