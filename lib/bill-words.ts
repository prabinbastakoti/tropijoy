const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones ? `${TENS[tens]} ${ONES[ones]}` : TENS[tens];
}

function threeDigits(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds) parts.push(`${ONES[hundreds]} Hundred`);
  if (rest) parts.push(twoDigits(rest));
  return parts.join(" ");
}

/**
 * Converts a Rupee amount to words using the Indian/Nepali numbering system
 * (Thousand, Lakh, Crore) for the printed "Amount in Words" line on the bill.
 * e.g. 152340 -> "Rupees One Lakh Fifty Two Thousand Three Hundred Forty Only"
 */
export function numberToWords(amount: number): string {
  const rounded = Math.round(Math.abs(amount));
  if (rounded === 0) return "Zero Only";

  const crore = Math.floor(rounded / 1_00_00_000);
  const lakh = Math.floor((rounded % 1_00_00_000) / 1_00_000);
  const thousand = Math.floor((rounded % 1_00_000) / 1_000);
  const hundred = rounded % 1_000;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));

  return `${parts.join(" ")} Only`;
}
