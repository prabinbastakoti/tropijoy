import NepaliDate from "nepali-date-converter";

/**
 * Converts an ISO "YYYY-MM-DD" AD date to its Bikram Sambat "Miti"
 * (also "YYYY-MM-DD", BS), e.g. "2026-05-02" -> "2083-01-19".
 */
export function adToBsDate(isoDate: string): string {
  if (!isoDate) return "—";
  const jsDate = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(jsDate.getTime())) return "—";
  try {
    return new NepaliDate(jsDate).format("YYYY-MM-DD");
  } catch {
    return "—";
  }
}
