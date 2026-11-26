import { useState } from "react";
import type { Gender, Pieces } from "@/lib/custom-made";

export type JacketStyle = "Havana" | "Milano" | "Roma";

export const jacketStyles: { name: JacketStyle; image: string }[] = [
  { name: "Havana", image: "/custom-made/options/jacket/Havana Jacket.png" },
  { name: "Milano", image: "/custom-made/options/jacket/Milano Jacket.png" },
  { name: "Roma", image: "/custom-made/options/jacket/Roma Jacket.png" },
];

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 12 12"
    width="10"
    height="10"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    aria-hidden="true"
    className={`transition-transform duration-200 ${open ? "-rotate-90" : "rotate-90"}`}
  >
    <path d="m4.5 2.5 3 3.5-3 3.5" />
  </svg>
);

export function JacketStyleSelector({
  gender,
  onGender,
  pieces,
  onTogglePiece,
  selectedStyle,
  onStyle,
}: {
  gender: Gender;
  onGender: (gender: Gender) => void;
  pieces: Pieces;
  onTogglePiece: (piece: "trousers" | "waistcoat") => void;
  selectedStyle: Record<Gender, JacketStyle | null>;
  onStyle: (gender: Gender, style: JacketStyle) => void;
}) {
  const [openGenders, setOpenGenders] = useState<Record<Gender, boolean>>({ men: false, women: false });
  const [openJackets, setOpenJackets] = useState<Record<Gender, boolean>>({ men: false, women: false });

  const toggleGender = (target: Gender) => {
    setOpenGenders((current) => ({ ...current, [target]: !current[target] }));
  };

  return (
    <div aria-label="Try on for" className="mb-9 flex justify-center gap-12 md:mb-11">
      {(["men", "women"] as Gender[]).map((item) => {
        const open = openGenders[item];
        const label = item === "men" ? "MEN" : "WOMEN";

        return (
          <div key={item} className="min-w-0">
            <div className="flex items-center">
              <button
                type="button"
                aria-pressed={gender === item}
                onClick={() => onGender(item)}
                className={`border-b pb-1 text-[12px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${gender === item ? "border-ink text-ink" : "border-transparent text-slate hover:text-ink"}`}
              >
                {label}
              </button>
              <button
                type="button"
                aria-label={`${open ? "Collapse" : "Expand"} ${label}`}
                aria-expanded={open}
                onClick={() => toggleGender(item)}
                className="ml-2 flex h-7 w-7 items-center justify-center border-b border-transparent text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
                  <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
                    <path d="m2.5 4.5 3.5 3 3.5-3" />
                  </svg>
                </span>
              </button>
            </div>

            {open && (
              <div className="mt-3 border-l border-ink/12 pl-4">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => onStyle(item, selectedStyle[item] ?? "Havana")}
                    className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  >
                    Jacket
                  </button>
                  <button
                    type="button"
                    aria-label={`${openJackets[item] ? "Collapse" : "Expand"} Jacket styles`}
                    aria-expanded={openJackets[item]}
                    onClick={() => setOpenJackets((current) => ({ ...current, [item]: !current[item] }))}
                    className="ml-2 flex h-7 w-7 items-center justify-center text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    <Chevron open={openJackets[item]} />
                  </button>
                </div>

                {openJackets[item] && (
                  <div className="ml-4 mt-2 border-l border-ink/12">
                    {jacketStyles.map((style) => (
                      <button
                        key={style.name}
                        type="button"
                        aria-pressed={selectedStyle[item] === style.name}
                        onClick={() => onStyle(item, style.name)}
                        className={`block w-full px-3 py-2 text-left text-[12px] uppercase tracking-[0.14em] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold ${selectedStyle[item] === style.name ? "text-ink" : "text-slate hover:text-ink"}`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  aria-pressed={pieces.trousers}
                  onClick={() => onTogglePiece("trousers")}
                  className={`mt-2 block py-2 text-[12px] font-medium uppercase tracking-[0.18em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${pieces.trousers ? "text-ink" : "text-slate hover:text-ink"}`}
                >
                  Trouser
                </button>
                <button
                  type="button"
                  aria-pressed={pieces.waistcoat}
                  onClick={() => onTogglePiece("waistcoat")}
                  className={`block py-2 text-[12px] font-medium uppercase tracking-[0.18em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${pieces.waistcoat ? "text-ink" : "text-slate hover:text-ink"}`}
                >
                  Waistcoat
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}