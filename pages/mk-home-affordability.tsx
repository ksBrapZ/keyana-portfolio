// @ts-nocheck

import Head from 'next/head';
import { useState, useMemo } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const formatCurrency = (n) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n.toFixed(0)}`;
};

const formatFull = (n) =>
  "$" + Math.round(n).toLocaleString("en-US");

const Slider = ({ label, value, onChange, min, max, step, format, suffix }) => (
  <div className="mb-5">
    <div className="flex items-baseline justify-between mb-1.5">
      <span className="text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-sm text-foreground/90">
        {format ? format(value) : value}{suffix || ""}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
      style={{ accentColor: "#a5b4fc" }}
    />
  </div>
);

const Row = ({ label, value, highlight, sub, warn }) => (
  <div className="flex justify-between items-baseline py-2 border-b border-border/40">
    <span
      className={`font-sans ${sub ? "text-[0.7rem] text-muted-foreground/70 pl-4" : "text-xs text-muted-foreground"}`}
    >
      {sub ? "↳ " : ""}{label}
    </span>
    <span
      className={[
        "font-mono",
        highlight ? "text-lg font-semibold text-primary" : "",
        sub && !highlight ? "text-[0.7rem] text-muted-foreground/70" : "",
        !sub && !highlight ? "text-sm text-foreground/90" : "",
        warn ? "text-destructive" : "",
      ].join(" ").trim()}
    >
      {value}
    </span>
  </div>
);

const Section = ({ children }) => (
  <div className="mb-7">
    {children}
  </div>
);

export default function HomeAffordability() {
  const [downPayment, setDownPayment] = useState(200000);
  const [rate, setRate] = useState(6.0);
  const [propertyTaxRate, setPropertyTaxRate] = useState(0.45);
  const [insurance, setInsurance] = useState(400);
  const [hoa, setHoa] = useState(0);
  const [closingCostPct, setClosingCostPct] = useState(3.0);
  const [maxMonthly, setMaxMonthly] = useState(4500);

  const calc = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const n = 360;

    // Work backwards from max monthly payment to find max loan
    const availableForMortgage = maxMonthly - insurance - hoa - 1; // subtract insurance and HOA first
    // But property tax depends on home price, so we need to iterate

    // P&I + tax = availableForMortgage
    // P&I = loan * [r(1+r)^n / ((1+r)^n - 1)]
    // tax = homePrice * propertyTaxRate/100 / 12
    // homePrice = loan + downPayment
    // So: loan * factor + (loan + downPayment) * taxMonthly = available
    // loan * (factor + taxMonthly) = available - downPayment * taxMonthly
    // loan = (available - downPayment * taxMonthly) / (factor + taxMonthly)

    const factor = monthlyRate > 0
      ? (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      : 1 / n;
    const taxMonthly = propertyTaxRate / 100 / 12;

    const maxLoan = (availableForMortgage - downPayment * taxMonthly) / (factor + taxMonthly);
    const maxHomePrice = maxLoan + downPayment;

    const closingCosts = maxHomePrice * (closingCostPct / 100);
    const totalCashNeeded = downPayment + closingCosts;
    const cashRemaining = 500000 - totalCashNeeded;
    const ltv = (maxLoan / maxHomePrice) * 100;
    const needsPMI = ltv > 80;
    const pmiMonthly = needsPMI ? maxLoan * 0.005 / 12 : 0;

    // Recalculate with PMI if needed
    let finalLoan = maxLoan;
    let finalHomePrice = maxHomePrice;
    if (needsPMI) {
      const availableAfterPMI = availableForMortgage; // PMI comes out of the budget too
      // loan * (factor + taxMonthly + 0.005/12) = available - downPayment * taxMonthly
      const finalMaxLoan = (availableAfterPMI - downPayment * taxMonthly) / (factor + taxMonthly + 0.005 / 12);
      finalLoan = finalMaxLoan;
      finalHomePrice = finalMaxLoan + downPayment;
    }

    const monthlyPI = finalLoan * factor;
    const monthlyTax = finalHomePrice * taxMonthly;
    const finalPMI = (finalLoan / finalHomePrice) > 0.8 ? finalLoan * 0.005 / 12 : 0;
    const totalMonthly = monthlyPI + monthlyTax + insurance + hoa + finalPMI;
    const finalClosing = finalHomePrice * (closingCostPct / 100);
    const finalCashNeeded = downPayment + finalClosing;
    const finalCashRemaining = 500000 - finalCashNeeded;
    const finalLTV = (finalLoan / finalHomePrice) * 100;
    const totalInterest = monthlyPI * 360 - finalLoan;

    // DTI check (assuming $350k gross = ~$29,167/mo)
    const grossMonthly = 350000 / 12;
    const dti = (totalMonthly / grossMonthly) * 100;

    return {
      homePrice: finalHomePrice,
      loanAmount: finalLoan,
      monthlyPI,
      monthlyTax,
      insurance,
      hoa,
      pmi: finalPMI,
      totalMonthly,
      closingCosts: finalClosing,
      totalCashNeeded: finalCashNeeded,
      cashRemaining: finalCashRemaining,
      ltv: finalLTV,
      dti,
      totalInterest,
      downPaymentPct: (downPayment / finalHomePrice) * 100,
    };
  }, [downPayment, rate, propertyTaxRate, insurance, hoa, closingCostPct, maxMonthly]);

  const pieData = [
    { label: "Principal & Interest", value: calc.monthlyPI, color: "#a5b4fc" }, // indigo-300
    { label: "Property Tax", value: calc.monthlyTax, color: "#bfdbfe" }, // blue-200
    { label: "Insurance", value: calc.insurance, color: "#bbf7d0" }, // green-200
    ...(calc.hoa > 0 ? [{ label: "HOA", value: calc.hoa, color: "#fecaca" }] : []), // red-200
    ...(calc.pmi > 0 ? [{ label: "PMI", value: calc.pmi, color: "#fed7aa" }] : []), // orange-200
  ];
  const pieTotal = pieData.reduce((s, d) => s + d.value, 0);

  let cumAngle = 0;
  const arcs = pieData.map((d) => {
    const pct = d.value / pieTotal;
    const startAngle = cumAngle;
    cumAngle += pct * 360;
    const endAngle = cumAngle;
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const r = 70;
    const cx = 90, cy = 90;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = pct > 0.5 ? 1 : 0;
    const path =
      pct >= 0.9999
        ? `M ${cx},${cy - r} A ${r},${r} 0 1 1 ${cx - 0.01},${cy - r} Z`
        : `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
    return { ...d, path, pct };
  });

  return (
    <>
      <Head>
        <title>Home Affordability · M &amp; K</title>
        <meta
          name="description"
          content="Private home affordability calculator for M & K, based on YNAB budget assumptions."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-screen-lg py-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight">
                  M&amp;K Home Affordability
                </h1>
              </div>

              {/* Big Number */}
              <div className="text-center px-5 py-8 rounded-xl border border-border/40 bg-background/40">
                <div className="text-4xl md:text-5xl font-semibold text-primary leading-tight mb-1">
                  {formatFull(calc.homePrice)}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  at {formatFull(maxMonthly)}/mo all-in · {rate}% rate · {formatFull(downPayment)} down
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Controls */}
                <div className="rounded-xl border border-border/40 bg-background/60 p-5 md:p-6">
                  <Slider
                    label="Max Monthly Housing"
                    value={maxMonthly}
                    onChange={setMaxMonthly}
                    min={3000}
                    max={7000}
                    step={100}
                    format={formatFull}
                  />
                  <Slider
                    label="Down Payment"
                    value={downPayment}
                    onChange={setDownPayment}
                    min={50000}
                    max={500000}
                    step={10000}
                    format={formatFull}
                  />
                  <Slider
                    label="Mortgage Rate"
                    value={rate}
                    onChange={setRate}
                    min={5.0}
                    max={7.5}
                    step={0.125}
                    suffix="%"
                  />
                  <Slider
                    label="Property Tax Rate"
                    value={propertyTaxRate}
                    onChange={setPropertyTaxRate}
                    min={0.3}
                    max={0.8}
                    step={0.05}
                    suffix="% effective"
                  />
                  <Slider
                    label="Monthly Insurance"
                    value={insurance}
                    onChange={setInsurance}
                    min={150}
                    max={700}
                    step={25}
                    format={(v) => `$${v}`}
                  />
                  <Slider
                    label="Monthly HOA"
                    value={hoa}
                    onChange={setHoa}
                    min={0}
                    max={500}
                    step={25}
                    format={(v) => `$${v}`}
                  />
                  <Slider
                    label="Closing Costs"
                    value={closingCostPct}
                    onChange={setClosingCostPct}
                    min={2.0}
                    max={5.0}
                    step={0.5}
                    suffix="% of price"
                  />
                </div>

                {/* Right: Results */}
                <div className="space-y-4">
                  {/* Donut Chart */}
                  <div className="rounded-xl border border-border/40 bg-background/60 p-5 md:p-6 flex items-center gap-4 md:gap-6">
                    <svg width="180" height="180" viewBox="0 0 180 180" className="shrink-0">
                      {arcs.map((arc, i) => (
                        <path key={i} d={arc.path} fill={arc.color} opacity={0.9} />
                      ))}
                      <circle cx="90" cy="90" r="44" fill="hsl(var(--background))" />
                      <text
                        x="90"
                        y="84"
                        textAnchor="middle"
                        className="font-mono"
                        fill="currentColor"
                        fontSize="16"
                        fontWeight="500"
                      >
                        {formatFull(calc.totalMonthly)}
                      </text>
                      <text
                        x="90"
                        y="102"
                        textAnchor="middle"
                        fill="hsl(var(--muted-foreground))"
                        fontSize="9"
                      >
                        per month
                      </text>
                    </svg>

                    <div className="flex-1 space-y-2 text-xs">
                      {pieData.map((d, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: d.color }}
                          />
                          <span className="text-muted-foreground flex-1">{d.label}</span>
                          <span className="font-mono text-foreground text-[0.7rem]">
                            ${Math.round(d.value).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="rounded-xl border border-border/40 bg-background/60 p-5 md:p-6">
                    <Section title="Purchase Details">
                      <Row label="Home Price" value={formatFull(calc.homePrice)} highlight />
                      <Row
                        label="Down Payment"
                        value={`${formatFull(downPayment)} (${calc.downPaymentPct.toFixed(0)}%)`}
                      />
                      <Row label="Loan Amount" value={formatFull(calc.loanAmount)} />
                      <Row label="Loan-to-Value" value={`${calc.ltv.toFixed(1)}%`} />
                      {calc.pmi > 0 && (
                        <Row label="⚠ PMI Required" value={`$${Math.round(calc.pmi)}/mo`} warn />
                      )}
                    </Section>

                    <Section title="Cash at Closing">
                      <Row label="Down Payment" value={formatFull(downPayment)} sub />
                      <Row
                        label={`Closing Costs (~${closingCostPct}%)`}
                        value={formatFull(calc.closingCosts)}
                        sub
                      />
                      <Row label="Total Cash Needed" value={formatFull(calc.totalCashNeeded)} highlight />
                      <Row
                        label="Remaining from $500k Fund"
                        value={formatFull(Math.max(0, calc.cashRemaining))}
                        warn={calc.cashRemaining < 0}
                      />
                    </Section>

                    <Section title="Qualification Check">
                      <Row
                        label="Front-end DTI"
                        value={`${calc.dti.toFixed(1)}%`}
                        warn={calc.dti > 28}
                      />
                      <Row
                        label="Lender Max (43% DTI)"
                        value={formatFull((350000 / 12) * 0.43)}
                        sub
                      />
                      <Row
                        label="Your Target"
                        value={`${formatFull(maxMonthly)}/mo`}
                        sub
                      />
                      <Row
                        label="Status"
                        value={
                          calc.dti < 28
                            ? "✓ Conservative"
                            : calc.dti < 36
                            ? "✓ Comfortable"
                            : calc.dti < 43
                            ? "⚠ Stretching"
                            : "✗ Over limit"
                        }
                      />
                    </Section>

                    <Section title="Long-term Cost">
                      <Row label="Total Interest (30yr)" value={formatFull(calc.totalInterest)} />
                      <Row
                        label="Total Paid (30yr)"
                        value={formatFull(calc.totalInterest + calc.loanAmount)}
                      />
                    </Section>
                  </div>
                </div>
              </div>

              {/* Scenario Comparison */}
              <div className="rounded-xl border border-border/40 bg-background/60 p-5 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[100000, 200000, 300000, 400000].map((dp) => {
                    const r = 0.06 / 12;
                    const n = 360;
                    const fac = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                    const taxM = 0.0045 / 12;
                    const avail = 4500 - 400 - 0;
                    const loan = (avail - dp * taxM) / (fac + taxM);
                    const hp = loan + dp;
                    const ltvVal = (loan / hp) * 100;
                    const isActive = dp === downPayment;

                    return (
                      <div
                        key={dp}
                        className={[
                          "rounded-lg px-3 py-4 text-center border text-xs space-y-1",
                          isActive
                            ? "border-primary/60 bg-primary/10"
                            : "border-border/30 bg-background/40",
                        ]
                          .join(" ")
                          .trim()}
                      >
                        <div className="text-[0.7rem] text-muted-foreground">
                          {formatCurrency(dp)} down
                        </div>
                        <div
                          className={[
                            "text-xl font-medium",
                            isActive ? "text-primary" : "text-foreground",
                          ]
                            .join(" ")
                            .trim()}
                        >
                          {formatCurrency(hp)}
                        </div>
                        <div className="text-[0.7rem] text-muted-foreground">
                          {ltvVal.toFixed(0)}% LTV{ltvVal > 80 ? " · PMI" : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-2 rounded-xl border border-emerald-800/40 bg-emerald-950/30 p-5 text-xs leading-relaxed">
                <div className="space-y-1.5 text-emerald-100/80">
                  <p>
                    • Colorado has some of the lowest effective property tax rates in the country
                    (~0.35–0.55% depending on county and district). Front Range counties like
                    Boulder, Jefferson, and Douglas tend toward 0.4–0.55%.
                  </p>
                  <p>
                    • Colorado insurance is expensive due to hail and wildfire risk — budget
                    $350–550/mo for an $800k+ home. Impact-resistant roofing and shopping 3–5
                    carriers can save significantly.
                  </p>
                  <p>
                    • With one self-employed income, lenders typically want 2 years of tax
                    returns. Your Esper income history looks consistent, which is good.
                  </p>
                  <p>
                    • Your $132k emergency fund stays fully intact — this analysis only touches
                    the $500k downpayment fund.
                  </p>
                  <p>
                    • Your front-end DTI at $4,500/mo is ~15.4% — extremely conservative. Lenders
                    allow up to 43–50%.
                  </p>
                </div>
              </div>

              <div className="text-center mt-4 text-[0.65rem] text-muted-foreground/70">
                Not financial advice · Consult a mortgage professional for pre-approval · Rates and
                taxes are estimates
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

