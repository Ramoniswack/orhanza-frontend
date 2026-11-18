"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  calculateBespokeFit,
  cmToFeetInches,
  kgToLbs,
  type FitCategory,
  type FitPreference,
  type FitRecommendation,
  type ProportionLevel,
} from "@/lib/fit-advisor";
import { BodySilhouette } from "./BodySilhouette";

export interface CommissionContext {
  title: string;
  subtitle: string;
  category?: FitCategory;
}

interface FitAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  commission: CommissionContext;
  onApplyFitProfile: (recommendation: FitRecommendation) => void;
}

const proportions: ProportionLevel[] = ["Narrower", "Average", "Fuller"];
const preferences: FitPreference[] = ["Tailored / Slim", "Classic / Balanced", "Relaxed / Drape"];

function Icon({ name }: { name: "close" | "plus" | "minus" | "back" | "next" | "check" | "chevron" }) {
  const paths = {
    close: <path d="m6 6 12 12M18 6 6 18" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    back: <path d="m15 18-6-6 6-6" />,
    next: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
  }[name];

  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths}
    </svg>
  );
}

function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={`min-h-10 border px-2 text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${value === option ? "border-ink bg-ink text-ivory" : "border-ink/20 bg-white text-ink hover:border-ink/60"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FitAdvisorDrawer({
  isOpen,
  onClose,
  commission,
  onApplyFitProfile,
}: FitAdvisorDrawerProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [heightUnit, setHeightUnit] = useState<"CM" | "FT/IN">("CM");
  const [weightUnit, setWeightUnit] = useState<"KG" | "LB">("KG");
  const [category, setCategory] = useState<FitCategory>(commission.category ?? "MENSWEAR");
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(75);
  const [shoulders, setShoulders] = useState<ProportionLevel>("Average");
  const [chest, setChest] = useState<ProportionLevel>("Average");
  const [waist, setWaist] = useState<ProportionLevel>("Average");
  const [preference, setPreference] = useState<FitPreference>("Classic / Balanced");
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setStep(1);
    setCategory(commission.category ?? "MENSWEAR");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, commission.category, onClose]);

  const recommendation = useMemo(
    () => calculateBespokeFit({ category, heightCm, weightKg, shoulders, chest, waist, preference }),
    [category, heightCm, weightKg, shoulders, chest, waist, preference],
  );

  const updateHeight = (value: number) => setHeightCm(Math.min(205, Math.max(150, value)));
  const updateWeight = (value: number) => setWeightKg(Math.min(135, Math.max(45, value)));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close fit advisor"
            className="fixed inset-0 z-[80] cursor-default bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Orhanza fit advisor"
            className="fixed inset-y-0 right-0 z-[81] flex w-full max-w-[480px] flex-col border-l border-ink/12 bg-white text-ink shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <header className="flex items-center justify-between border-b border-ink/12 px-6 py-4">
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate">Orhanza Fit Advisor</span>
              <button type="button" onClick={onClose} aria-label="Close fit advisor" className="flex h-9 w-9 items-center justify-center text-slate transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-gold">
                <Icon name="close" />
              </button>
            </header>

            <div className="border-b border-ink/12 px-6 pb-4 pt-4">
              <div className="flex items-center gap-3 rounded border border-ink/10 bg-white p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-ink text-[10px] font-semibold tracking-widest text-gold">ORH</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{commission.title}</p>
                  <p className="truncate text-xs text-slate">{commission.subtitle}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-1.5" aria-hidden="true">
                {[1, 2, 3].map((index) => <div key={index} className={`h-[3px] rounded-full ${step >= index ? "bg-ink" : "bg-ink/12"}`} />)}
              </div>
              <p className="mt-2 text-[10px] font-medium text-slate" aria-live="polite">
                {step === 1 ? "Step 1 of 3 · Measurements" : step === 2 ? "Step 2 of 3 · Proportions & drape" : "Step 3 of 3 · Starting block"}
              </p>
            </div>

            <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="measurements" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="space-y-6 pt-5">
                    <div>
                      <h2 className="text-[26px] font-light tracking-[-0.03em]">Let’s find your block</h2>
                      <p className="mt-1 text-sm text-slate">A few details help us suggest a starting point.</p>
                    </div>

                    <div role="group" aria-label="Sizing category" className="grid grid-cols-2 rounded bg-ink/5 p-1">
                      {(["WOMENSWEAR", "MENSWEAR"] as const).map((option) => (
                        <button key={option} type="button" aria-pressed={category === option} onClick={() => setCategory(option)} className={`rounded py-2.5 text-[10px] font-medium tracking-[0.14em] transition-colors ${category === option ? "bg-ink text-ivory" : "text-slate hover:text-ink"}`}>
                          {option}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <BodySilhouette category={category} heightCm={heightCm} weightKg={weightKg} shoulders={shoulders} waist={waist} />
                      <div className="min-w-0 flex-1 space-y-5">
                        <div>
                          <div className="flex items-center justify-between">
                            <label htmlFor="fit-height" className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate">Height</label>
                            <div className="flex border border-ink/15 text-[9px] font-medium">
                              {(["CM", "FT/IN"] as const).map((unit) => <button key={unit} type="button" aria-pressed={heightUnit === unit} onClick={() => setHeightUnit(unit)} className={`px-2 py-1 ${heightUnit === unit ? "bg-ink text-ivory" : "bg-white text-slate"}`}>{unit}</button>)}
                            </div>
                          </div>
                          <p className="mb-2 mt-1 text-2xl font-light tabular-nums">{heightUnit === "CM" ? `${heightCm} cm` : cmToFeetInches(heightCm)}</p>
                          <div className="flex items-center gap-2">
                            <button type="button" aria-label="Decrease height" onClick={() => updateHeight(heightCm - 1)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-white"><Icon name="minus" /></button>
                            <input id="fit-height" type="range" min={150} max={205} value={heightCm} onChange={(event) => updateHeight(Number(event.target.value))} aria-valuetext={heightUnit === "CM" ? `${heightCm} centimetres` : cmToFeetInches(heightCm)} className="h-1.5 min-w-0 flex-1 accent-ink" />
                            <button type="button" aria-label="Increase height" onClick={() => updateHeight(heightCm + 1)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-white"><Icon name="plus" /></button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <label htmlFor="fit-weight" className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate">Weight</label>
                            <div className="flex border border-ink/15 text-[9px] font-medium">
                              {(["KG", "LB"] as const).map((unit) => <button key={unit} type="button" aria-pressed={weightUnit === unit} onClick={() => setWeightUnit(unit)} className={`px-2 py-1 ${weightUnit === unit ? "bg-ink text-ivory" : "bg-white text-slate"}`}>{unit}</button>)}
                            </div>
                          </div>
                          <p className="mb-2 mt-1 text-2xl font-light tabular-nums">{weightUnit === "KG" ? `${weightKg} kg` : `${kgToLbs(weightKg)} lb`}</p>
                          <div className="flex items-center gap-2">
                            <button type="button" aria-label="Decrease weight" onClick={() => updateWeight(weightKg - 1)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-white"><Icon name="minus" /></button>
                            <input id="fit-weight" type="range" min={45} max={135} value={weightKg} onChange={(event) => updateWeight(Number(event.target.value))} aria-valuetext={weightUnit === "KG" ? `${weightKg} kilograms` : `${kgToLbs(weightKg)} pounds`} className="h-1.5 min-w-0 flex-1 accent-ink" />
                            <button type="button" aria-label="Increase weight" onClick={() => updateWeight(weightKg + 1)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-white"><Icon name="plus" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="border-l border-gold pl-3 text-xs leading-relaxed text-slate">Your measurements stay in this browser session and are not needed to make a booking.</p>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="proportions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="space-y-6 pt-5">
                    <div>
                      <h2 className="text-[26px] font-light tracking-[-0.03em]">How do you like it to sit?</h2>
                      <p className="mt-1 text-sm text-slate">These choices guide the initial block, not the final pattern.</p>
                    </div>
                    <ChoiceGroup label="Shoulders" value={shoulders} options={proportions} onChange={setShoulders} />
                    <ChoiceGroup label="Chest" value={chest} options={proportions} onChange={setChest} />
                    <ChoiceGroup label="Waist" value={waist} options={proportions} onChange={setWaist} />
                    <div role="group" aria-label="Fit preference">
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate">Fit preference</p>
                      <div className="space-y-2">
                        {preferences.map((option) => (
                          <button key={option} type="button" aria-pressed={preference === option} onClick={() => setPreference(option)} className={`flex w-full items-center justify-between border px-3 py-3 text-left text-sm transition-colors ${preference === option ? "border-ink bg-white" : "border-ink/15 hover:border-ink/50"}`}>
                            <span>{option}</span>
                            <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${preference === option ? "border-ink bg-ink text-ivory" : "border-ink/25"}`}>{preference === option && <Icon name="check" />}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="recommendation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="space-y-6 pt-5">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate">{recommendation.headline}</p>
                      <p className="mt-2 text-5xl font-light tracking-[-0.04em]">{recommendation.baseSize}</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate">{recommendation.summary}</p>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em]">
                        <span>Fit balance</span>
                        <span className="text-slate">{preference}</span>
                      </div>
                      <div className="relative h-1.5 bg-ink/10">
                        <span className="absolute left-1/2 top-0 h-1.5 w-1/3 -translate-x-1/2 bg-gold/60" />
                        <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink" style={{ left: `${recommendation.overallBalance}%` }} />
                      </div>
                    </div>

                    <div className="border-y border-ink/12">
                      {recommendation.zones.map((zone) => (
                        <div key={zone.zone} className="border-b border-ink/12 py-4 last:border-b-0">
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="text-sm font-medium">{zone.zone}</h3>
                            <span className="text-[10px] text-slate">{zone.meterPosition < 45 ? "Closer" : zone.meterPosition > 55 ? "More room" : "Balanced"}</span>
                          </div>
                          <div className="relative my-2.5 h-1 bg-ink/10">
                            <span className="absolute left-1/2 top-0 h-1 w-1/3 -translate-x-1/2 bg-gold/60" />
                            <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink" style={{ left: `${zone.meterPosition}%` }} />
                          </div>
                          <p className="text-xs leading-relaxed text-slate">{zone.status}</p>
                        </div>
                      ))}
                    </div>

                    <button type="button" aria-expanded={showSizeChart} onClick={() => setShowSizeChart((shown) => !shown)} className="flex w-full items-center justify-between border-b border-ink/15 pb-3 text-left text-sm font-medium">
                      <span>Explore the starting size range</span>
                      <span className={`transition-transform ${showSizeChart ? "rotate-180" : ""}`}><Icon name="chevron" /></span>
                    </button>
                    {showSizeChart && (
                      <div className="flex flex-wrap gap-2" aria-label="Available starting sizes">
                        {recommendation.sizeSpectrum.map((size) => <span key={size} className={`border px-3 py-2 text-xs ${size === recommendation.baseSize ? "border-ink bg-ink text-ivory" : "border-ink/15"}`}>{size}</span>)}
                      </div>
                    )}
                    <p className="text-[11px] leading-relaxed text-slate">This is an estimate, not a finished garment size. Final measurements and alterations are confirmed with your tailor.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-ink/12 bg-white p-5">
              {step > 1 ? (
                <button type="button" onClick={() => setStep((current) => (current === 3 ? 2 : 1))} className="inline-flex h-12 items-center gap-2 border border-ink/20 px-4 text-[10px] font-medium uppercase tracking-[0.16em]">
                  <Icon name="back" /> Back
                </button>
              ) : <span className="text-[10px] text-slate">About 30 seconds</span>}
              {step < 3 ? (
                <button type="button" onClick={() => setStep((current) => (current === 1 ? 2 : 3))} className="inline-flex h-12 items-center gap-3 bg-ink px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold hover:text-ink">
                  Continue <Icon name="next" />
                </button>
              ) : (
                <button type="button" onClick={() => onApplyFitProfile(recommendation)} className="inline-flex h-12 items-center gap-3 bg-ink px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold hover:text-ink">
                  Apply starting block <Icon name="check" />
                </button>
              )}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
