// @ts-nocheck

import { useState, useMemo } from "react";

const formatCurrency = (n) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n.toFixed(0)}`;
};

const formatFull = (n) =>
  "$" + Math.round(n).toLocaleString("en-US");

const Slider = ({ label, value, onChange, min, max, step, format, suffix }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#8a8a8a", letterSpacing: "0.02em" }}>
        {label}
      </span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#e8e4df", fontWeight: 500 }}>
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
      style={{ width: "100%", accentColor: "#c9a96e" }}
    />
  </div>
);

const Row = ({ label, value, highlight, sub, warn }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    <span
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: sub ? 12 : 13,
        color: sub ? "#6a6a6a" : "#8a8a8a",
        paddingLeft: sub ? 16 : 0,
      }}
    >
      {sub ? "↳ " : ""}{label}
    </span>
    <span
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: highlight ? 18 : sub ? 12 : 14,
        color: warn ? "#d4785a" : highlight ? "#c9a96e" : sub ? "#6a6a6a" : "#e8e4df",
        fontWeight: highlight ? 600 : 400,
      }}
    >
      {value}
    </span>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#5a5a5a",
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {title}
    </div>
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
    { label: "Principal & Interest", value: calc.monthlyPI, color: "#c9a96e" },
    { label: "Property Tax", value: calc.monthlyTax, color: "#7a9e7e" },
    { label: "Insurance", value: calc.insurance, color: "#6a8caf" },
    ...(calc.hoa > 0 ? [{ label: "HOA", value: calc.hoa, color: "#a07eb5" }] : []),
    ...(calc.pmi > 0 ? [{ label: "PMI", value: calc.pmi, color: "#d4785a" }] : []),
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
    <div
      style={{
        minHeight: "100vh",
        background: "#151311",
        color: "#e8e4df",
        fontFamily: "'DM Sans', sans-serif",
        padding: "32px 16px",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5a5a5a", marginBottom: 8 }}>
            M & K · Colorado Front Range
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 36,
              fontWeight: 600,
              color: "#e8e4df",
              margin: "0 0 8px",
              lineHeight: 1.1,
            }}
          >
            Home Affordability
          </h1>
          <div style={{ fontSize: 13, color: "#6a6a6a" }}>
            Based on your YNAB budget · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
        </div>

        {/* Big Number */}
        <div
          style={{
            textAlign: "center",
            padding: "36px 20px",
            marginBottom: 32,
            background: "linear-gradient(135deg, rgba(201,169,110,0.08), rgba(201,169,110,0.02))",
            borderRadius: 16,
            border: "1px solid rgba(201,169,110,0.15)",
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8a8a8a", marginBottom: 8 }}>
            Maximum Home Price
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 52,
              fontWeight: 700,
              color: "#c9a96e",
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            {formatFull(calc.homePrice)}
          </div>
          <div style={{ fontSize: 13, color: "#6a6a6a" }}>
            at {formatFull(maxMonthly)}/mo all-in · {rate}% rate · {formatFull(downPayment)} down
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Left: Controls */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              borderRadius: 14,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a5a5a", marginBottom: 20 }}>
              Adjust Assumptions
            </div>

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
          <div>
            {/* Donut Chart */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: 14,
                padding: 24,
                border: "1px solid rgba(255,255,255,0.06)",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <svg width="180" height="180" viewBox="0 0 180 180">
                {arcs.map((arc, i) => (
                  <path key={i} d={arc.path} fill={arc.color} opacity={0.85} />
                ))}
                <circle cx="90" cy="90" r="44" fill="#151311" />
                <text x="90" y="84" textAnchor="middle" fill="#e8e4df" fontFamily="'DM Mono', monospace" fontSize="16" fontWeight="500">
                  {formatFull(calc.totalMonthly)}
                </text>
                <text x="90" y="102" textAnchor="middle" fill="#6a6a6a" fontFamily="'DM Sans', sans-serif" fontSize="9">
                  per month
                </text>
              </svg>
              <div style={{ flex: 1 }}>
                {pieData.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                    <span style={{ color: "#8a8a8a", flex: 1 }}>{d.label}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", color: "#e8e4df", fontSize: 12 }}>
                      ${Math.round(d.value).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: 14,
                padding: 24,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Section title="Purchase Details">
                <Row label="Home Price" value={formatFull(calc.homePrice)} highlight />
                <Row label="Down Payment" value={`${formatFull(downPayment)} (${calc.downPaymentPct.toFixed(0)}%)`} />
                <Row label="Loan Amount" value={formatFull(calc.loanAmount)} />
                <Row label="Loan-to-Value" value={`${calc.ltv.toFixed(1)}%`} />
                {calc.pmi > 0 && <Row label="⚠ PMI Required" value={`$${Math.round(calc.pmi)}/mo`} warn />}
              </Section>

              <Section title="Cash at Closing">
                <Row label="Down Payment" value={formatFull(downPayment)} sub />
                <Row label={`Closing Costs (~${closingCostPct}%)`} value={formatFull(calc.closingCosts)} sub />
                <Row label="Total Cash Needed" value={formatFull(calc.totalCashNeeded)} highlight />
                <Row
                  label="Remaining from $500k Fund"
                  value={formatFull(Math.max(0, calc.cashRemaining))}
                  warn={calc.cashRemaining < 0}
                />
              </Section>

              <Section title="Qualification Check">
                <Row label="Front-end DTI" value={`${calc.dti.toFixed(1)}%`} warn={calc.dti > 28} />
                <Row label="Lender Max (43% DTI)" value={formatFull((350000 / 12) * 0.43)} sub />
                <Row label="Your Target" value={`${formatFull(maxMonthly)}/mo`} sub />
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
                <Row label="Total Paid (30yr)" value={formatFull(calc.totalInterest + calc.loanAmount)} />
              </Section>
            </div>
          </div>
        </div>

        {/* Scenario Comparison */}
        <div
          style={{
            marginTop: 24,
            background: "rgba(255,255,255,0.02)",
            borderRadius: 14,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a5a5a", marginBottom: 16 }}>
            Quick Scenarios at $4,500/mo · 6% Rate · 0.45% Tax
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[100000, 200000, 300000, 400000].map((dp) => {
              const r = 0.06 / 12;
              const n = 360;
              const fac = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
              const taxM = 0.0045 / 12;
              const avail = 4500 - 400 - 0;
              const loan = (avail - dp * taxM) / (fac + taxM);
              const hp = loan + dp;
              const ltvVal = (loan / hp) * 100;
              return (
                <div
                  key={dp}
                  style={{
                    background: dp === downPayment ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.02)",
                    borderRadius: 10,
                    padding: 16,
                    textAlign: "center",
                    border: dp === downPayment ? "1px solid rgba(201,169,110,0.3)" : "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#6a6a6a", marginBottom: 4 }}>
                    {formatCurrency(dp)} down
                  </div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 22,
                      fontWeight: 600,
                      color: dp === downPayment ? "#c9a96e" : "#e8e4df",
                      marginBottom: 4,
                    }}
                  >
                    {formatCurrency(hp)}
                  </div>
                  <div style={{ fontSize: 10, color: "#5a5a5a" }}>
                    {ltvVal.toFixed(0)}% LTV{ltvVal > 80 ? " · PMI" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div
          style={{
            marginTop: 24,
            padding: 20,
            background: "rgba(122,158,126,0.06)",
            borderRadius: 12,
            border: "1px solid rgba(122,158,126,0.12)",
            fontSize: 12,
            color: "#7a9e7e",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ display: "block", marginBottom: 6 }}>Notes on your situation</strong>
          <div style={{color: "#8a8a8a"}}>
            • Colorado has some of the lowest effective property tax rates in the country (~0.35–0.55% depending on county and district).
            Front Range counties like Boulder, Jefferson, and Douglas tend toward 0.4–0.55%.<br />
            • Colorado insurance is expensive due to hail and wildfire risk — budget $350–550/mo for an $800k+ home.
            Impact-resistant roofing and shopping 3–5 carriers can save significantly.<br />
            • With one self-employed income, lenders typically want 2 years of tax returns. Your Esper income history looks consistent, which is good.<br />
            • Your $132k emergency fund stays fully intact — this analysis only touches the $500k downpayment fund.<br />
            • Your front-end DTI at $4,500/mo is ~15.4% — extremely conservative. Lenders allow up to 43–50%.
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 32, fontSize: 10, color: "#3a3a3a" }}>
          Not financial advice · Consult a mortgage professional for pre-approval · Rates and taxes are estimates
        </div>
      </div>
    </div>
  );
}

