export type FitCategory = "MENSWEAR" | "WOMENSWEAR";
export type ProportionLevel = "Narrower" | "Average" | "Fuller";
export type FitPreference = "Tailored / Slim" | "Classic / Balanced" | "Relaxed / Drape";

export interface FitProfileInput {
  category: FitCategory;
  heightCm: number;
  weightKg: number;
  shoulders: ProportionLevel;
  chest: ProportionLevel;
  waist: ProportionLevel;
  preference: FitPreference;
}

export interface ZoneBreakdown {
  zone: "Shoulders" | "Chest" | "Waist" | "Jacket Length";
  status: string;
  meterPosition: number;
}

export interface FitRecommendation {
  category: FitCategory;
  preference: FitPreference;
  baseSize: string;
  euSize: number;
  lengthCode: "S" | "R" | "L";
  headline: string;
  summary: string;
  zones: ZoneBreakdown[];
  sizeSpectrum: string[];
  overallBalance: number;
}

export function cmToFeetInches(cm: number): string {
  const totalInches = Math.round(cm / 2.54);
  return `${Math.floor(totalInches / 12)}'${totalInches % 12}"`;
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}

export function calculateBespokeFit(input: FitProfileInput): FitRecommendation {
  const { category, heightCm, weightKg, shoulders, chest, waist, preference } = input;
  const lengthCode =
    category === "MENSWEAR"
      ? heightCm < 173
        ? "S"
        : heightCm > 184
          ? "L"
          : "R"
      : heightCm < 163
        ? "S"
        : heightCm > 175
          ? "L"
          : "R";

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let rawEu =
    category === "MENSWEAR"
      ? 44 + (weightKg - 58) * 0.24 + (bmi - 21) * 0.35
      : 34 + (weightKg - 48) * 0.24 + (bmi - 20) * 0.35;

  if (chest === "Fuller") rawEu += 1.5;
  if (chest === "Narrower") rawEu -= 1.2;
  if (shoulders === "Fuller") rawEu += 0.8;
  if (preference === "Relaxed / Drape") rawEu += 1;
  if (preference === "Tailored / Slim") rawEu -= 0.6;

  const validSizes =
    category === "MENSWEAR"
      ? [44, 46, 48, 50, 52, 54, 56]
      : [34, 36, 38, 40, 42, 44, 46];
  const euSize = validSizes.reduce((closest, size) =>
    Math.abs(size - rawEu) < Math.abs(closest - rawEu) ? size : closest,
  );
  const baseSize = `${euSize}${lengthCode}`;

  const shoulderStatus =
    shoulders === "Fuller"
      ? "Allow extra room through the shoulder for a clean drape."
      : shoulders === "Narrower"
        ? "A closer shoulder line may reduce excess overhang."
        : "A balanced shoulder line is a good starting point.";
  const chestStatus =
    chest === "Fuller"
      ? "Allow additional ease through the chest."
      : chest === "Narrower"
        ? "A closer chest block may keep the front clean."
        : "A balanced chest block is a good starting point.";
  const waistStatus =
    waist === "Fuller"
      ? "Allow additional room through the waist."
      : waist === "Narrower"
        ? "A more shaped waist may suit your proportions."
        : "A balanced waist shape is a good starting point.";
  const lengthStatus =
    lengthCode === "L"
      ? `Long jacket block suggested for a ${cmToFeetInches(heightCm)} frame.`
      : lengthCode === "S"
        ? "Short jacket block suggested to balance proportions."
        : "Regular jacket block suggested as a starting point.";

  return {
    category,
    preference,
    baseSize,
    euSize,
    lengthCode,
    headline: "Suggested starting block",
    summary: `${baseSize} is an initial fitting-block estimate. Your tailor will confirm the pattern and measurements in person.`,
    zones: [
      {
        zone: "Shoulders",
        status: shoulderStatus,
        meterPosition: shoulders === "Narrower" ? 38 : shoulders === "Fuller" ? 64 : 50,
      },
      {
        zone: "Chest",
        status: chestStatus,
        meterPosition: chest === "Narrower" ? 40 : chest === "Fuller" ? 62 : 50,
      },
      {
        zone: "Waist",
        status: waistStatus,
        meterPosition: waist === "Narrower" ? 35 : waist === "Fuller" ? 66 : 50,
      },
      { zone: "Jacket Length", status: lengthStatus, meterPosition: 50 },
    ],
    sizeSpectrum: validSizes.map((size) => `${size}${lengthCode}`),
    overallBalance: preference === "Tailored / Slim" ? 36 : preference === "Relaxed / Drape" ? 68 : 52,
  };
}

export function formatFitRecommendation(recommendation: FitRecommendation): string {
  return [
    `${recommendation.headline}: ${recommendation.baseSize}`,
    recommendation.summary,
    `Category: ${recommendation.category === "MENSWEAR" ? "Menswear" : "Womenswear"}. Fit preference: ${recommendation.preference}.`,
    ...recommendation.zones.map((zone) => `${zone.zone}: ${zone.status}`),
  ].join("\n");
}

export function isFitRecommendation(value: unknown): value is FitRecommendation {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<FitRecommendation>;
  return (
    (candidate.category === "MENSWEAR" || candidate.category === "WOMENSWEAR") &&
    (candidate.preference === "Tailored / Slim" ||
      candidate.preference === "Classic / Balanced" ||
      candidate.preference === "Relaxed / Drape") &&
    typeof candidate.baseSize === "string" &&
    typeof candidate.euSize === "number" &&
    (candidate.lengthCode === "S" || candidate.lengthCode === "R" || candidate.lengthCode === "L") &&
    typeof candidate.headline === "string" &&
    typeof candidate.summary === "string" &&
    Array.isArray(candidate.zones) &&
    candidate.zones.every(
      (zone) =>
        zone &&
        typeof zone.zone === "string" &&
        typeof zone.status === "string" &&
        typeof zone.meterPosition === "number",
    ) &&
    Array.isArray(candidate.sizeSpectrum) &&
    candidate.sizeSpectrum.every((size) => typeof size === "string") &&
    typeof candidate.overallBalance === "number"
  );
}
