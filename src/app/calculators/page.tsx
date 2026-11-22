"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner } from "@/components/avenlo/motion";
import {
  DonutChart,
  ObsidianBarChart,
  PayoffAreaChart,
  type PayoffPoint,
} from "@/components/avenlo/calculator-charts";
import { EnquiryForm } from "@/components/site/enquiry-form";

type CalcMode = "mortgage" | "dld" | "offplan" | "yield" | "buyrent";

const MODES: { id: CalcMode; label: string }[] = [
  { id: "mortgage", label: "UAE Mortgage" },
  { id: "dld", label: "DLD 4% Upfront Costs" },
  { id: "offplan", label: "Off-Plan Schedule" },
  { id: "yield", label: "Net Rental Yield" },
  { id: "buyrent", label: "5-Year Buy vs Rent" },
];

const OFFPLAN_PLANS = {
  "60-40": { label: "60 / 40 Construction-Linked", booking: 10, during: 50, handover: 40 },
  "70-30": { label: "70 / 30 Standard Developer Plan", booking: 20, during: 50, handover: 30 },
  "80-20": { label: "80 / 20 Master Villa Plan", booking: 10, during: 70, handover: 20 },
  "1pct": { label: "1% Monthly Structured Plan", booking: 20, during: 45, handover: 35 },
} as const;

function sliderBg(val: number, min: number, max: number) {
  const pct = Math.max(0, Math.min(100, ((val - min) / Math.max(1, max - min)) * 100));
  return {
    background: `linear-gradient(to right, #121212 ${pct}%, #d4d4d4 ${pct}%)`,
  };
}

export default function CalculatorsPage() {
  const { formatPrice } = usePrefs();
  const [mode, setMode] = useState<CalcMode>("mortgage");

  // 1. UAE Mortgage State (UAE Central Bank LTV: 20% Resident / 40% Non-Resident)
  const [price, setPrice] = useState(2500000);
  const [depositPct, setDepositPct] = useState(20);
  const [termYears, setTermYears] = useState(25);
  const [ratePct, setRatePct] = useState(4.49);
  const [monthlyService, setMonthlyService] = useState(1450);
  const [monthlyInsurance, setMonthlyInsurance] = useState(220);
  const [showSchedule, setShowSchedule] = useState(false);

  // 2. DLD Upfront State
  const [dldPrice, setDldPrice] = useState(2500000);
  const [dldType, setDldType] = useState<"secondary" | "offplan">("secondary");
  const [dldFinanced, setDldFinanced] = useState(true);

  // 3. Off-Plan State
  const [opPrice, setOpPrice] = useState(2200000);
  const [opPlanKey, setOpPlanKey] = useState<keyof typeof OFFPLAN_PLANS>("60-40");

  // 4. Net Rental Yield State
  const [yPrice, setYPrice] = useState(2000000);
  const [yAnnualRent, setYAnnualRent] = useState(160000);
  const [yAreaSqFt, setYAreaSqFt] = useState(1150);
  const [yServiceRate, setYServiceRate] = useState(18);
  const [yMgmtPct, setYMgmtPct] = useState(5);

  // 5. 5-Year Buy vs Rent State
  const [brPrice, setBrPrice] = useState(2400000);
  const [brAnnualRent, setBrAnnualRent] = useState(165000);
  const [brRentGrowth, setBrRentGrowth] = useState(4);
  const [brAppreciation, setBrAppreciation] = useState(5);

  // Mortgage calculations + amortization curve
  const mortgage = useMemo(() => {
    const deposit = Math.round((price * depositPct) / 100);
    const loan = Math.max(0, price - deposit);
    const ltv = Math.round((loan / Math.max(1, price)) * 100);
    const r = ratePct / 100 / 12;
    const n = termYears * 12;
    const monthlyPI =
      loan === 0
        ? 0
        : r === 0
        ? loan / n
        : (loan * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    const totalMonthly = monthlyPI + monthlyService + monthlyInsurance;
    const totalRepaid = monthlyPI * n;
    const totalInterest = Math.max(0, totalRepaid - loan);

    const points: PayoffPoint[] = [
      { year: 0, balance: loan, principalPaid: 0, interestPaid: 0 },
    ];
    let bal = loan;
    let cumP = 0;
    let cumI = 0;
    for (let yr = 1; yr <= termYears; yr++) {
      for (let m = 0; m < 12; m++) {
        const interest = bal * r;
        const principal = Math.min(bal, Math.max(0, monthlyPI - interest));
        bal = Math.max(0, bal - principal);
        cumP += principal;
        cumI += interest;
      }
      points.push({
        year: yr,
        balance: Math.round(bal),
        principalPaid: Math.round(cumP),
        interestPaid: Math.round(cumI),
      });
    }

    return {
      deposit,
      loan,
      ltv,
      monthlyPI: Math.round(monthlyPI),
      totalMonthly: Math.round(totalMonthly),
      totalRepaid: Math.round(totalRepaid),
      totalInterest: Math.round(totalInterest),
      points,
    };
  }, [price, depositPct, termYears, ratePct, monthlyService, monthlyInsurance]);

  // DLD 4% Upfront calculations
  const dldCalc = useMemo(() => {
    const dldFee = Math.round(dldPrice * 0.04);
    const adminFee = dldType === "secondary" ? (dldPrice >= 500000 ? 4200 : 2100) + 580 : 3000;
    const agencyFee = dldType === "secondary" ? Math.round(dldPrice * 0.02 * 1.05) : 0;
    const mortgageReg = dldFinanced ? Math.round(dldPrice * 0.8 * 0.0025) + 290 : 0;
    const totalFees = dldFee + adminFee + agencyFee + mortgageReg;
    const pct = ((totalFees / Math.max(1, dldPrice)) * 100).toFixed(2);
    return { dldFee, adminFee, agencyFee, mortgageReg, totalFees, pct };
  }, [dldPrice, dldType, dldFinanced]);

  // Off-Plan schedule
  const opCalc = useMemo(() => {
    const plan = OFFPLAN_PLANS[opPlanKey];
    const bookingAed = Math.round((opPrice * plan.booking) / 100);
    const dldOqood = Math.round(opPrice * 0.04) + 3000;
    const duringAed = Math.round((opPrice * plan.during) / 100);
    const handoverAed = Math.round((opPrice * plan.handover) / 100);
    return { plan, bookingAed, dldOqood, duringAed, handoverAed, upfront: bookingAed + dldOqood };
  }, [opPrice, opPlanKey]);

  // Net rental yield
  const yieldCalc = useMemo(() => {
    const annualService = Math.round(yAreaSqFt * yServiceRate);
    const mgmtFee = Math.round((yAnnualRent * yMgmtPct) / 100);
    const netRent = Math.max(0, yAnnualRent - annualService - mgmtFee);
    const grossPct = (yAnnualRent / Math.max(1, yPrice)) * 100;
    const netPct = (netRent / Math.max(1, yPrice)) * 100;
    return { annualService, mgmtFee, netRent, grossPct, netPct };
  }, [yPrice, yAnnualRent, yAreaSqFt, yServiceRate, yMgmtPct]);

  // 5-Year Buy vs Rent
  const buyRent = useMemo(() => {
    let totalRent5Yr = 0;
    let yrRent = brAnnualRent;
    for (let i = 0; i < 5; i++) {
      totalRent5Yr += yrRent;
      yrRent *= 1 + brRentGrowth / 100;
    }
    const downPayment = brPrice * 0.2;
    const dldUpfront = brPrice * 0.062;
    const loan = brPrice * 0.8;
    const r = 0.045 / 12;
    const n = 300;
    const mPay = (loan * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    const payments5Yr = mPay * 60;
    const estFutureValue = brPrice * Math.pow(1 + brAppreciation / 100, 5);
    const equityGained = estFutureValue - brPrice + loan * 0.13;
    const netBuyCost = Math.max(0, dldUpfront + payments5Yr - equityGained);
    const advantage = Math.round(totalRent5Yr - netBuyCost);
    return {
      totalRent5Yr: Math.round(totalRent5Yr),
      netBuyCost: Math.round(netBuyCost),
      estFutureValue: Math.round(estFutureValue),
      downPayment: Math.round(downPayment),
      advantage,
    };
  }, [brPrice, brAnnualRent, brRentGrowth, brAppreciation]);

  return (
    <div className="bg-white">
      <AvenloPageHeader
        eyebrow="CALCULATORS · DUBAI & UAE"
        title="What it"
        italic="really costs"
        lead="Model UAE mortgage repayments, 4% DLD transfer fees, off-plan payment milestones, net rental yields, and 5-year buy-vs-rent outcomes in real time."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators" },
        ]}
      />

      <section className="mx-auto max-w-[1260px] px-4 py-12 sm:px-8">
        {/* Avenlo Pill Mode Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-medium transition-colors ${
                mode === m.id
                  ? "bg-[#121212] text-white"
                  : "border border-black/10 bg-white text-[#525252] hover:border-[#121212] hover:text-[#121212]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* MODE 1: UAE MORTGAGE (Exact Avenlo 2-Column + Full-Width Mint Payoff Curve) */}
        {mode === "mortgage" ? (
          <div className="mt-10 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Crisp #F7F7F7 Sliders Card */}
              <div className="lg:col-span-6 rounded-2xl border border-black/[0.06] bg-[#f7f7f7] p-6 sm:p-8 space-y-6">
                {/* Property Price */}
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="m-price" className="font-medium text-[#121212]">
                      Property price
                    </label>
                    <span className="font-medium text-[#737373] tabular-nums">
                      {formatPrice(price, { includeApprox: false })}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center rounded-xl border border-black/10 bg-white px-4 py-3">
                    <span className="mr-2 text-xs font-medium text-[#8b8b8b]">AED</span>
                    <input
                      id="m-price"
                      type="number"
                      min={300000}
                      max={50000000}
                      step={50000}
                      value={price}
                      onChange={(e) => setPrice(Math.max(300000, Number(e.target.value) || 0))}
                      className="w-full bg-transparent text-base font-medium text-[#121212] tabular-nums focus:outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    aria-label="Property price slider"
                    min={500000}
                    max={25000000}
                    step={50000}
                    value={Math.min(25000000, price)}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    style={sliderBg(Math.min(25000000, price), 500000, 25000000)}
                    className="avenlo-range mt-4"
                  />
                </div>

                {/* Deposit + UAE Central Bank LTV Presets */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-[#121212]">Down payment</span>
                    <span className="font-medium text-[#737373] tabular-nums">
                      {formatPrice(mortgage.deposit, { includeApprox: false })} · {depositPct}%
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      { pct: 20, label: "UAE Resident (20% min)" },
                      { pct: 40, label: "Non-Resident (40% min)" },
                      { pct: 50, label: "50% Equity" },
                    ].map((preset) => (
                      <button
                        key={preset.pct}
                        type="button"
                        onClick={() => setDepositPct(preset.pct)}
                        className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                          depositPct === preset.pct
                            ? "bg-[#121212] text-white"
                            : "border border-black/10 bg-white text-[#525252] hover:text-[#121212]"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    aria-label="Down payment percentage"
                    min={20}
                    max={80}
                    step={1}
                    value={depositPct}
                    onChange={(e) => setDepositPct(Number(e.target.value))}
                    style={sliderBg(depositPct, 20, 80)}
                    className="avenlo-range mt-4"
                  />
                </div>

                {/* Term & Interest Rate */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="m-term" className="font-medium text-[#121212]">
                        Term
                      </label>
                      <span className="text-[#737373]">{termYears} years</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-2.5">
                      <input
                        id="m-term"
                        type="number"
                        min={5}
                        max={25}
                        value={termYears}
                        onChange={(e) =>
                          setTermYears(Math.max(5, Math.min(25, Number(e.target.value) || 5)))
                        }
                        className="w-20 bg-transparent text-sm font-medium text-[#121212] tabular-nums focus:outline-none"
                      />
                      <span className="text-xs text-[#8b8b8b]">yrs</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Mortgage term slider"
                      min={5}
                      max={25}
                      value={termYears}
                      onChange={(e) => setTermYears(Number(e.target.value))}
                      style={sliderBg(termYears, 5, 25)}
                      className="avenlo-range mt-3.5"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="m-rate" className="font-medium text-[#121212]">
                        Interest rate
                      </label>
                      <span className="text-[#737373]">{ratePct.toFixed(2)}%</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-2.5">
                      <input
                        id="m-rate"
                        type="number"
                        min={2}
                        max={9}
                        step={0.05}
                        value={ratePct}
                        onChange={(e) =>
                          setRatePct(Math.max(1, Math.min(12, Number(e.target.value) || 1)))
                        }
                        className="w-20 bg-transparent text-sm font-medium text-[#121212] tabular-nums focus:outline-none"
                      />
                      <span className="text-xs text-[#8b8b8b]">%</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Interest rate slider"
                      min={2.5}
                      max={8}
                      step={0.05}
                      value={Math.min(8, Math.max(2.5, ratePct))}
                      onChange={(e) => setRatePct(Number(e.target.value))}
                      style={sliderBg(Math.min(8, Math.max(2.5, ratePct)), 2.5, 8)}
                      className="avenlo-range mt-3.5"
                    />
                  </div>
                </div>

                {/* Monthly Extras */}
                <div className="border-t border-black/[0.08] pt-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8b8b8b]">
                    MONTHLY EXTRAS (EST.)
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="m-service" className="mb-1 block text-xs text-[#737373]">
                        Service charge (AED/mo)
                      </label>
                      <input
                        id="m-service"
                        type="number"
                        min={0}
                        step={50}
                        value={monthlyService}
                        onChange={(e) => setMonthlyService(Math.max(0, Number(e.target.value) || 0))}
                        className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm font-medium text-[#121212] tabular-nums"
                      />
                    </div>
                    <div>
                      <label htmlFor="m-ins" className="mb-1 block text-xs text-[#737373]">
                        Building / life insurance (AED/mo)
                      </label>
                      <input
                        id="m-ins"
                        type="number"
                        min={0}
                        step={25}
                        value={monthlyInsurance}
                        onChange={(e) =>
                          setMonthlyInsurance(Math.max(0, Number(e.target.value) || 0))
                        }
                        className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm font-medium text-[#121212] tabular-nums"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right #121212 Obsidian Summary + Donut Chart Card */}
              <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl bg-[#121212] p-6 sm:p-9 text-white">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                    ESTIMATED MONTHLY PAYMENT
                  </p>
                  <p className="mt-2 text-[40px] sm:text-[54px] font-medium leading-none tracking-[-0.04em] text-white tabular-nums">
                    {formatPrice(mortgage.totalMonthly, { includeApprox: false })}
                  </p>

                  <div className="mt-8">
                    <DonutChart
                      slices={[
                        {
                          label: "Capital & interest",
                          value: mortgage.monthlyPI,
                          color: "#ffffff",
                          display: formatPrice(mortgage.monthlyPI, { includeApprox: false }),
                        },
                        {
                          label: "Service charge",
                          value: monthlyService,
                          color: "#51fec0",
                          display: formatPrice(monthlyService, { includeApprox: false }),
                        },
                        {
                          label: "Insurance",
                          value: monthlyInsurance,
                          color: "#8b8b8b",
                          display: formatPrice(monthlyInsurance, { includeApprox: false }),
                        },
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-9 grid grid-cols-2 gap-6 border-t border-white/[0.12] pt-7">
                  <div>
                    <p className="text-xs text-[#8b8b8b]">Loan amount</p>
                    <p className="mt-1 text-lg font-medium text-white tabular-nums">
                      {formatPrice(mortgage.loan, { includeApprox: false })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8b8b8b]">Loan to value (LTV)</p>
                    <p className="mt-1 text-lg font-medium text-[#51fec0] tabular-nums">
                      {mortgage.ltv}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8b8b8b]">Total interest</p>
                    <p className="mt-1 text-lg font-medium text-white tabular-nums">
                      {formatPrice(mortgage.totalInterest, { includeApprox: false })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8b8b8b]">Total repaid</p>
                    <p className="mt-1 text-lg font-medium text-white tabular-nums">
                      {formatPrice(mortgage.totalRepaid, { includeApprox: false })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width "What you still owe" Payoff Mint Area Chart Card */}
            <div className="rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                    WHAT YOU STILL OWE
                  </p>
                  <h2 className="mt-1.5 text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#121212]">
                    {formatPrice(mortgage.loan, { includeApprox: false })} paid down over {termYears}{" "}
                    years
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSchedule((v) => !v)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/12 bg-white px-5 py-2.5 text-xs font-medium text-[#121212] hover:bg-[#f7f7f7]"
                >
                  <span>{showSchedule ? "Hide year-by-year" : "Show the year-by-year"}</span>
                  {showSchedule ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <div className="mt-6">
                <PayoffAreaChart
                  points={mortgage.points}
                  formatVal={(v) => formatPrice(v, { compact: true, includeApprox: false })}
                />
              </div>

              {showSchedule ? (
                <div className="mt-6 max-h-72 overflow-y-auto rounded-xl border border-black/[0.08]">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-[#f7f7f7] text-[#121212]">
                      <tr>
                        <th className="p-3 font-medium">Year</th>
                        <th className="p-3 font-medium">Remaining Balance</th>
                        <th className="p-3 font-medium">Cumulative Principal</th>
                        <th className="p-3 font-medium">Cumulative Interest</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.05] tabular-nums">
                      {mortgage.points.slice(1).map((row) => (
                        <tr key={row.year}>
                          <td className="p-3 font-medium">Year {row.year}</td>
                          <td className="p-3">{formatPrice(row.balance, { includeApprox: false })}</td>
                          <td className="p-3 text-[#0e9f6e]">
                            {formatPrice(row.principalPaid, { includeApprox: false })}
                          </td>
                          <td className="p-3 text-[#737373]">
                            {formatPrice(row.interestPaid, { includeApprox: false })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* MODE 2: DLD 4% UPFRONT COSTS */}
        {mode === "dld" ? (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6 rounded-2xl border border-black/[0.06] bg-[#f7f7f7] p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="dld-price" className="font-medium text-[#121212]">
                    Purchase price (AED)
                  </label>
                  <span className="text-[#737373]">{formatPrice(dldPrice, { includeApprox: false })}</span>
                </div>
                <input
                  id="dld-price"
                  type="number"
                  min={300000}
                  step={50000}
                  value={dldPrice}
                  onChange={(e) => setDldPrice(Math.max(300000, Number(e.target.value) || 0))}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base font-medium text-[#121212] tabular-nums"
                />
                <input
                  type="range"
                  min={500000}
                  max={25000000}
                  step={50000}
                  value={Math.min(25000000, dldPrice)}
                  onChange={(e) => setDldPrice(Number(e.target.value))}
                  style={sliderBg(Math.min(25000000, dldPrice), 500000, 25000000)}
                  className="avenlo-range mt-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDldType("secondary")}
                  className={`cursor-pointer rounded-xl px-4 py-3 text-xs font-medium transition-colors ${
                    dldType === "secondary"
                      ? "bg-[#121212] text-white"
                      : "border border-black/10 bg-white text-[#525252]"
                  }`}
                >
                  Ready Secondary Resale
                </button>
                <button
                  type="button"
                  onClick={() => setDldType("offplan")}
                  className={`cursor-pointer rounded-xl px-4 py-3 text-xs font-medium transition-colors ${
                    dldType === "offplan"
                      ? "bg-[#121212] text-white"
                      : "border border-black/10 bg-white text-[#525252]"
                  }`}
                >
                  Primary Off-Plan Launch
                </button>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm">
                <input
                  type="checkbox"
                  checked={dldFinanced}
                  onChange={(e) => setDldFinanced(e.target.checked)}
                  className="h-4 w-4 accent-[#121212]"
                />
                <span>Include 0.25% DLD mortgage registration fee</span>
              </label>
            </div>

            <div className="lg:col-span-6 rounded-2xl bg-[#121212] p-6 sm:p-9 text-white flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                  TOTAL UPFRONT TRANSACTION FEES ({dldCalc.pct}%)
                </p>
                <p className="mt-2 text-[40px] sm:text-[50px] font-medium leading-none tracking-[-0.04em] tabular-nums">
                  {formatPrice(dldCalc.totalFees, { includeApprox: false })}
                </p>

                <div className="mt-8">
                  <DonutChart
                    slices={[
                      {
                        label: "4% DLD Transfer / Oqood",
                        value: dldCalc.dldFee,
                        color: "#ffffff",
                        display: formatPrice(dldCalc.dldFee, { includeApprox: false }),
                      },
                      {
                        label: dldType === "secondary" ? "Agency Fee (2% + VAT)" : "0% Primary Agency",
                        value: dldCalc.agencyFee,
                        color: "#51fec0",
                        display: formatPrice(dldCalc.agencyFee, { includeApprox: false }),
                      },
                      {
                        label: "Trustee / Admin & Mortgage Reg",
                        value: dldCalc.adminFee + dldCalc.mortgageReg,
                        color: "#8b8b8b",
                        display: formatPrice(dldCalc.adminFee + dldCalc.mortgageReg, {
                          includeApprox: false,
                        }),
                      },
                    ]}
                  />
                </div>
              </div>
              <p className="mt-8 border-t border-white/10 pt-5 text-xs text-[#8b8b8b]">
                Off-plan launches typically carry 0% buyer agency commission; secondary resales include 2% + 5% VAT plus DLD Trustee fees.
              </p>
            </div>
          </div>
        ) : null}

        {/* MODE 3: OFF-PLAN SCHEDULE */}
        {mode === "offplan" ? (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6 rounded-2xl border border-black/[0.06] bg-[#f7f7f7] p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="op-price" className="font-medium text-[#121212]">
                    Off-plan unit price (AED)
                  </label>
                  <span className="text-[#737373]">{formatPrice(opPrice, { includeApprox: false })}</span>
                </div>
                <input
                  id="op-price"
                  type="number"
                  min={500000}
                  step={50000}
                  value={opPrice}
                  onChange={(e) => setOpPrice(Math.max(500000, Number(e.target.value) || 0))}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base font-medium text-[#121212] tabular-nums"
                />
                <input
                  type="range"
                  min={600000}
                  max={20000000}
                  step={50000}
                  value={Math.min(20000000, opPrice)}
                  onChange={(e) => setOpPrice(Number(e.target.value))}
                  style={sliderBg(Math.min(20000000, opPrice), 600000, 20000000)}
                  className="avenlo-range mt-4"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-[#121212]">Select Developer Payment Plan</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(Object.keys(OFFPLAN_PLANS) as (keyof typeof OFFPLAN_PLANS)[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setOpPlanKey(k)}
                      className={`cursor-pointer rounded-xl px-4 py-3 text-left text-xs font-medium transition-colors ${
                        opPlanKey === k
                          ? "bg-[#121212] text-white"
                          : "border border-black/10 bg-white text-[#525252]"
                      }`}
                    >
                      {OFFPLAN_PLANS[k].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl bg-[#121212] p-6 sm:p-9 text-white flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                  DAY-ONE BOOKING + 4% DLD OQOOD
                </p>
                <p className="mt-2 text-[40px] sm:text-[50px] font-medium leading-none tracking-[-0.04em] text-[#51fec0] tabular-nums">
                  {formatPrice(opCalc.upfront, { includeApprox: false })}
                </p>

                <div className="mt-8">
                  <ObsidianBarChart
                    bars={[
                      {
                        label: `Booking (${opCalc.plan.booking}%)`,
                        value: opCalc.bookingAed,
                        display: formatPrice(opCalc.bookingAed, { includeApprox: false }),
                        color: "#51fec0",
                      },
                      {
                        label: "4% DLD Oqood + Admin",
                        value: opCalc.dldOqood,
                        display: formatPrice(opCalc.dldOqood, { includeApprox: false }),
                        color: "#8b8b8b",
                      },
                      {
                        label: `During Construction (${opCalc.plan.during}%)`,
                        value: opCalc.duringAed,
                        display: formatPrice(opCalc.duringAed, { includeApprox: false }),
                        color: "#ffffff",
                      },
                      {
                        label: `On Handover (${opCalc.plan.handover}%)`,
                        value: opCalc.handoverAed,
                        display: formatPrice(opCalc.handoverAed, { includeApprox: false }),
                        color: "#ffffff",
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="mt-8 border-t border-white/10 pt-5 flex items-center justify-between text-xs text-[#8b8b8b]">
                <span>0% Buyer Agency Fee on primary launches</span>
                <BracketLink href="/off-plan" variant="dark" size="sm">
                  Explore Premier Projects
                </BracketLink>
              </div>
            </div>
          </div>
        ) : null}

        {/* MODE 4: NET RENTAL YIELD */}
        {mode === "yield" ? (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6 rounded-2xl border border-black/[0.06] bg-[#f7f7f7] p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="y-price" className="mb-1.5 block text-xs font-medium">
                    Property Price (AED)
                  </label>
                  <input
                    id="y-price"
                    type="number"
                    step={50000}
                    value={yPrice}
                    onChange={(e) => setYPrice(Math.max(200000, Number(e.target.value) || 0))}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="y-rent" className="mb-1.5 block text-xs font-medium">
                    Expected Annual Rent (AED)
                  </label>
                  <input
                    id="y-rent"
                    type="number"
                    step={5000}
                    value={yAnnualRent}
                    onChange={(e) => setYAnnualRent(Math.max(10000, Number(e.target.value) || 0))}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="y-area" className="mb-1.5 block text-xs font-medium">
                    Unit Area (sq ft)
                  </label>
                  <input
                    id="y-area"
                    type="number"
                    step={50}
                    value={yAreaSqFt}
                    onChange={(e) => setYAreaSqFt(Math.max(200, Number(e.target.value) || 0))}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="y-sc" className="mb-1.5 block text-xs font-medium">
                    Mollak Service Charge (AED / sq ft)
                  </label>
                  <input
                    id="y-sc"
                    type="number"
                    step={1}
                    value={yServiceRate}
                    onChange={(e) => setYServiceRate(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium tabular-nums"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">Property Management Allowance</span>
                  <span className="text-[#737373]">{yMgmtPct}% of rent</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={yMgmtPct}
                  onChange={(e) => setYMgmtPct(Number(e.target.value))}
                  style={sliderBg(yMgmtPct, 0, 10)}
                  className="avenlo-range mt-3"
                />
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl bg-[#121212] p-6 sm:p-9 text-white flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                      ESTIMATED NET YIELD
                    </p>
                    <p className="mt-2 text-[44px] sm:text-[56px] font-medium leading-none tracking-[-0.04em] text-[#51fec0] tabular-nums">
                      {yieldCalc.netPct.toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b8b8b]">
                      Gross Yield
                    </p>
                    <p className="mt-1 text-2xl font-medium text-white tabular-nums">
                      {yieldCalc.grossPct.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <DonutChart
                    slices={[
                      {
                        label: "Net Annual Income",
                        value: yieldCalc.netRent,
                        color: "#51fec0",
                        display: formatPrice(yieldCalc.netRent, { includeApprox: false }),
                      },
                      {
                        label: "Mollak Service Charges",
                        value: yieldCalc.annualService,
                        color: "#ffffff",
                        display: formatPrice(yieldCalc.annualService, { includeApprox: false }),
                      },
                      {
                        label: "Management Fee",
                        value: yieldCalc.mgmtFee,
                        color: "#8b8b8b",
                        display: formatPrice(yieldCalc.mgmtFee, { includeApprox: false }),
                      },
                    ]}
                  />
                </div>
              </div>
              <p className="mt-8 border-t border-white/10 pt-5 text-xs text-[#8b8b8b]">
                Dubai residential rental income currently carries 0% personal income tax; confirm building-specific Mollak charges before acquisition.
              </p>
            </div>
          </div>
        ) : null}

        {/* MODE 5: 5-YEAR BUY VS RENT */}
        {mode === "buyrent" ? (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6 rounded-2xl border border-black/[0.06] bg-[#f7f7f7] p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="br-price" className="mb-1.5 block text-xs font-medium">
                    Target Purchase Price (AED)
                  </label>
                  <input
                    id="br-price"
                    type="number"
                    step={50000}
                    value={brPrice}
                    onChange={(e) => setBrPrice(Math.max(400000, Number(e.target.value) || 0))}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="br-rent" className="mb-1.5 block text-xs font-medium">
                    Comparable Annual Rent (AED)
                  </label>
                  <input
                    id="br-rent"
                    type="number"
                    step={5000}
                    value={brAnnualRent}
                    onChange={(e) => setBrAnnualRent(Math.max(20000, Number(e.target.value) || 0))}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium tabular-nums"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">Expected Annual Rent Escalation</span>
                  <span className="text-[#737373]">{brRentGrowth}% / yr</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={brRentGrowth}
                  onChange={(e) => setBrRentGrowth(Number(e.target.value))}
                  style={sliderBg(brRentGrowth, 0, 10)}
                  className="avenlo-range mt-3"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">Assumed Annual Capital Growth</span>
                  <span className="text-[#737373]">{brAppreciation}% / yr</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={brAppreciation}
                  onChange={(e) => setBrAppreciation(Number(e.target.value))}
                  style={sliderBg(brAppreciation, 0, 10)}
                  className="avenlo-range mt-3"
                />
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl bg-[#121212] p-6 sm:p-9 text-white flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                  5-YEAR NET BUYING ADVANTAGE (ILLUSTRATIVE)
                </p>
                <p className="mt-2 text-[40px] sm:text-[50px] font-medium leading-none tracking-[-0.04em] text-[#51fec0] tabular-nums">
                  {buyRent.advantage >= 0 ? "+" : ""}
                  {formatPrice(buyRent.advantage, { includeApprox: false })}
                </p>

                <div className="mt-8">
                  <ObsidianBarChart
                    bars={[
                      {
                        label: "5-Year Cumulative Rent Paid",
                        value: buyRent.totalRent5Yr,
                        display: formatPrice(buyRent.totalRent5Yr, { includeApprox: false }),
                        color: "#8b8b8b",
                      },
                      {
                        label: "Net 5-Year Buying Outlay (After Equity)",
                        value: buyRent.netBuyCost,
                        display: formatPrice(buyRent.netBuyCost, { includeApprox: false }),
                        color: "#51fec0",
                      },
                      {
                        label: "Projected Year-5 Property Value",
                        value: buyRent.estFutureValue,
                        display: formatPrice(buyRent.estFutureValue, { includeApprox: false }),
                        color: "#ffffff",
                      },
                    ]}
                  />
                </div>
              </div>
              <p className="mt-8 border-t border-white/10 pt-5 text-xs text-[#8b8b8b]">
                Assumes 20% resident deposit ({formatPrice(buyRent.downPayment, { includeApprox: false })}), 4.5% mortgage rate over 25 years, and 6.2% upfront DLD/resale costs.
              </p>
            </div>
          </div>
        ) : null}

        {/* Mandatory AED & Financial Disclaimer */}
        <p className="mt-6 text-center text-xs text-[#8b8b8b]">
          All calculator figures are indicative estimates in UAE Dirhams (AED) for general guidance only—not financial, mortgage, or tax advice. Foreign currency display conversions are approximate.
        </p>
      </section>

      <section className="border-t border-black/[0.06] bg-[#f7f7f7] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <EnquiryForm
            context="buying"
            heading="Request a written bank pre-approval & DLD cost sheet"
            subheading="Compare resident and non-resident UAE bank offers alongside exact developer or Trustee fees."
          />
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
