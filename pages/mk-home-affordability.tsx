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

const Row = ({ label, value, highlight, sub, warn, accent }) => (
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
      style={accent ? { color: "#f0ece6" } : undefined}
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
  const [downPayment, setDownPayment] = useState(400000);
  const [rate, setRate] = useState(6.25);
  const [propertyTaxRate, setPropertyTaxRate] = useState(0.55);
  const [insurance, setInsurance] = useState(600);
  const [hoa, setHoa] = useState(200);
  const [closingCostPct, setClosingCostPct] = useState(3.5);
  const [maxMonthly, setMaxMonthly] = useState(4500);
  const [maintenanceRate, setMaintenanceRate] = useState(1.0);
  const [buyerAgentPct, setBuyerAgentPct] = useState(2.8);
  const [utilityIncrease, setUtilityIncrease] = useState(600);

  const calc = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const n = 360;

    // Work backwards from max true monthly cost to find max loan
    // Max true cost includes: P&I + tax + insurance + HOA + PMI + utilities + maintenance
    const availableForMortgage = maxMonthly - insurance - hoa - utilityIncrease - 1;

    const factor = monthlyRate > 0
      ? (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      : 1 / n;
    const taxMonthly = propertyTaxRate / 100 / 12;
    const maintenanceMonthlyRate = maintenanceRate / 100 / 12;

    // P&I + tax + maintenance = availableForMortgage
    // P&I = loan * factor
    // tax = (loan + downPayment) * taxMonthly
    // maintenance = (loan + downPayment) * maintenanceMonthlyRate
    // => loan * (factor + taxMonthly + maintenanceMonthlyRate)
    //    = availableForMortgage - downPayment * (taxMonthly + maintenanceMonthlyRate)
    const baseMonthlyRate = factor + taxMonthly + maintenanceMonthlyRate;
    const maxLoan = (availableForMortgage - downPayment * (taxMonthly + maintenanceMonthlyRate)) / baseMonthlyRate;
    const maxHomePrice = maxLoan + downPayment;

    const closingCosts = maxHomePrice * (closingCostPct / 100);
    const totalCashNeeded = downPayment + closingCosts;
    const cashRemaining = 500000 - totalCashNeeded;
    const ltv = (maxLoan / maxHomePrice) * 100;
    const needsPMI = ltv > 80;

    // Recalculate with PMI if needed
    let finalLoan = maxLoan;
    let finalHomePrice = maxHomePrice;
    if (needsPMI) {
      const availableAfterPMI = availableForMortgage;
      const pmiMonthlyRate = 0.005 / 12;
      const rateWithPMI = factor + taxMonthly + maintenanceMonthlyRate + pmiMonthlyRate;
      const finalMaxLoan =
        (availableAfterPMI - downPayment * (taxMonthly + maintenanceMonthlyRate)) / rateWithPMI;
      finalLoan = finalMaxLoan;
      finalHomePrice = finalMaxLoan + downPayment;
    }

    const monthlyPI = finalLoan * factor;
    const monthlyTax = finalHomePrice * taxMonthly;
    const finalPMI = (finalLoan / finalHomePrice) > 0.8 ? finalLoan * 0.005 / 12 : 0;
    // Housing payment used for DTI (excludes maintenance + utilities)
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
  }, [
    downPayment,
    rate,
    propertyTaxRate,
    insurance,
    hoa,
    closingCostPct,
    maxMonthly,
    maintenanceRate,
    utilityIncrease,
  ]);

  const maintenanceMonthly = (calc.homePrice * maintenanceRate) / 100 / 12;

  const pieData = [
    { label: "Principal & Interest", value: calc.monthlyPI, color: "#a5b4fc" }, // indigo-300
    { label: "Property Tax", value: calc.monthlyTax, color: "#bfdbfe" }, // blue-200
    { label: "Insurance", value: calc.insurance, color: "#bbf7d0" }, // green-200
    ...(calc.hoa > 0 ? [{ label: "HOA", value: calc.hoa, color: "#fecaca" }] : []), // red-200
    ...(calc.pmi > 0 ? [{ label: "PMI", value: calc.pmi, color: "#fed7aa" }] : []), // orange-200
    ...(maintenanceMonthly > 0 ? [{ label: "Maintenance", value: maintenanceMonthly, color: "#e5e7eb" }] : []), // gray-200
    ...(utilityIncrease > 0 ? [{ label: "Utilities", value: utilityIncrease, color: "#ddd6fe" }] : []), // violet-200
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

  const housingPayment = calc.totalMonthly;
  const trueMonthlyCost = housingPayment + maintenanceMonthly + utilityIncrease;
  const buyerAgentCommission = buyerAgentPct > 0 ? (calc.homePrice * buyerAgentPct) / 100 : 0;
  const totalCashNeededWithAgent = calc.totalCashNeeded + buyerAgentCommission;
  const cashRemainingWithAgent = 500000 - totalCashNeededWithAgent;

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
                <div className="text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground mb-1.5">
                  Implied maximum home price
                </div>
                <div className="text-4xl md:text-5xl font-semibold text-primary leading-tight mb-1">
                  {formatFull(calc.homePrice)}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  at {formatFull(maxMonthly)}/mo true cost · {rate}% rate · {formatFull(downPayment)} down
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Controls */}
                <div className="rounded-xl border border-border/40 bg-background/60 p-5 md:p-6 space-y-1">
                  {/* Budget & price */}
                  <Slider
                    label="Max True Monthly Cost"
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
                    max={475000}
                    step={25000}
                    format={formatFull}
                  />

                  {/* Monthly cost components */}
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
                    max={1000}
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
                    label="Utility costs"
                    value={utilityIncrease}
                    onChange={setUtilityIncrease}
                    min={0}
                    max={1000}
                    step={50}
                    format={(v) => `$${v}`}
                  />
                  <Slider
                    label="Maintenance Reserve"
                    value={maintenanceRate}
                    onChange={setMaintenanceRate}
                    min={0.5}
                    max={2.0}
                    step={0.25}
                    suffix="% of home value/yr"
                  />

                  {/* One-time costs */}
                  <Slider
                    label="Closing Costs"
                    value={closingCostPct}
                    onChange={setClosingCostPct}
                    min={2.0}
                    max={5.0}
                    step={0.5}
                    suffix="% of price"
                  />
                  <Slider
                    label="Buyer's Agent Commission"
                    value={buyerAgentPct}
                    onChange={setBuyerAgentPct}
                    min={0}
                    max={3.0}
                    step={0.1}
                    suffix="% of price"
                  />
                </div>

                {/* Right: Results */}
                <div className="space-y-4">
                  {/* Donut Chart */}
                  <div className="rounded-xl border border-border/40 bg-background/60 p-5 md:p-6 flex items-center gap-4 md:gap-6">
                    <svg width="180" height="180" viewBox="0 0 180 180" className="shrink-0">
                      {arcs.map((arc, i) => (
                        <path key={i} d={arc.path} fill={arc.color} opacity={0.9}>
                          <title>
                            {arc.label}: ${Math.round(arc.value).toLocaleString()}
                          </title>
                        </path>
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
                        {formatFull(trueMonthlyCost)}
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

                    <Section>
                      <Row label="Down Payment" value={formatFull(downPayment)} sub />
                      <Row
                        label={`Closing Costs (~${closingCostPct}%)`}
                        value={formatFull(calc.closingCosts)}
                        sub
                      />
                      {buyerAgentPct > 0 && (
                        <Row
                          label={`Buyer's Agent (~${buyerAgentPct}%)`}
                          value={formatFull(buyerAgentCommission)}
                          sub
                        />
                      )}
                      <Row
                        label="Total Cash Needed"
                        value={formatFull(totalCashNeededWithAgent)}
                        highlight
                      />
                      <Row
                        label="Remaining from $500k Fund"
                        value={formatFull(Math.max(0, cashRemainingWithAgent))}
                        warn={cashRemainingWithAgent < 0}
                      />
                    </Section>

                    <Section>
                      <div className="text-[0.65rem] tracking-[0.18em] uppercase text-muted-foreground mb-2.5">
                        True Monthly Cost of Ownership
                      </div>
                      <Row
                        label="Housing Payment (PITI + HOA)"
                        value={formatFull(housingPayment)}
                        highlight
                      />
                      <Row
                        label="↳ Principal & Interest"
                        value={formatFull(calc.monthlyPI)}
                        sub
                      />
                      <Row
                        label="↳ Property Tax"
                        value={formatFull(calc.monthlyTax)}
                        sub
                      />
                      <Row
                        label="↳ Insurance"
                        value={formatFull(insurance)}
                        sub
                      />
                      {hoa > 0 && (
                        <Row
                          label="↳ HOA"
                          value={formatFull(hoa)}
                          sub
                        />
                      )}
                      {calc.pmi > 0 && (
                        <Row
                          label="↳ PMI"
                          value={formatFull(calc.pmi)}
                          sub
                          warn
                        />
                      )}
                      <Row
                        label="Maintenance Reserve"
                        value={formatFull(maintenanceMonthly)}
                      />
                      <Row
                        label="Utilities"
                        value={formatFull(utilityIncrease)}
                      />
                      <Row
                        label="True Monthly Cost"
                        value={formatFull(trueMonthlyCost)}
                        highlight
                        accent
                      />
                      <div className="mt-1.5 text-[0.7rem] text-muted-foreground">
                        Housing Payment is your hard commitment. Maintenance and utilities are
                        variable but should be budgeted for.
                      </div>
                    </Section>

                    <Section>
                      <div className="text-[0.65rem] tracking-[0.18em] uppercase text-muted-foreground mb-2.5">
                        Compared to Current Situation
                      </div>
                      <Row
                        label="Current Total Housing Cost"
                        value={formatFull(6100)}
                      />
                      <Row
                        label="True Monthly Cost (owning)"
                        value={formatFull(trueMonthlyCost)}
                      />
                      <Row
                        label="Difference (owning - current)"
                        value={formatFull(trueMonthlyCost - 6100)}
                        warn={trueMonthlyCost > 6100}
                      />
                    </Section>

                    <Section>
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
                <div className="text-[0.65rem] tracking-[0.18em] uppercase text-muted-foreground mb-4">
                  {`Quick Scenarios at ${formatFull(maxMonthly)}/mo true cost · ${rate.toFixed(
                    2,
                  )}% Rate · ${propertyTaxRate.toFixed(2)}% Tax`}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[100000, 200000, 300000, 400000].map((dp) => {
                    const r = rate / 100 / 12;
                    const n = 360;
                    const fac = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                    const taxM = (propertyTaxRate / 100) / 12;
                    const maintM = maintenanceRate / 100 / 12;
                    const avail = maxMonthly - insurance - hoa - utilityIncrease;
                    const combined = fac + taxM + maintM;
                    const loan = (avail - dp * (taxM + maintM)) / combined;
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
                    • Property tax: Colorado has some of the lowest effective rates in the country.
                    Front Range effective rates by county: Denver 0.48%, JeffCo 0.51%, Arapahoe 0.52%,
                    Boulder 0.55%, Adams 0.60%. Douglas County is the lowest in the Denver metro.
                  </p>
                  <p>
                    • Insurance: Colorado Front Range is expensive due to hail (50% of premiums) and
                    wildfire risk. Budget $350–550/mo for $800k+ homes. Impact-resistant (Class 4)
                    roofing and shopping 3–5 carriers can save significantly. Note: hail deductibles
                    are often 1–3% of dwelling coverage ($8k–$24k out of pocket per claim).
                  </p>
                  <p>
                    • Self-employment: With one W-2 and one self-employed income, lenders typically
                    require 2 years of tax returns for the self-employed earner and may price the
                    rate slightly higher.
                  </p>
                  <p>
                    • Emergency fund ($132k) stays fully intact — this analysis only uses the $500k
                    downpayment fund.
                  </p>
                  <p>
                    • Buyer's agent: Post-NAR settlement, sellers still typically cover buyer agent
                    fees in Colorado's current market, but plan for the possibility of paying
                    2.5–3% out of pocket (~$20–24k on an $800k home).
                  </p>
                  <p>
                    • Maintenance: The 1%/year rule is a long-run average. Colorado's hail, UV
                    exposure, and dry climate are especially hard on roofs, exterior paint, and
                    landscaping. Budget accordingly.
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

