import Image from "next/image";
import type { BillCompanyProfile } from "@/store/bill-store";
import { numberToWords } from "@/lib/bill-words";
import { cn, formatPrice } from "@/lib/utils";
import fonepayData from "@/data/fonepay.json";

const FONEPAY = fonepayData as { accountName: string; accountNumber: string; bankName: string };

export interface BillLineItem {
  id: string;
  particulars: string;
  batchNo: string;
  qty: number;
  rate: number;
}

export interface BillDocumentProps {
  copyLabel: string;
  /** Set false to omit the Original/Customer Copy badge — used by the on-screen reading preview, which shows a single generic copy. Defaults to true (print output is unaffected). */
  showBadge?: boolean;
  /** Overrides the outer padding — used to give the on-screen reading preview extra breathing room without touching the print layout's tuned spacing. Defaults to the print padding. */
  padding?: string;
  invoiceNo: string;
  dateISO: string;
  payMode: string;
  company: BillCompanyProfile;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerPan: string;
  items: BillLineItem[];
  discount: number;
  deliveryFee: number;
}

/** A PAN number (or similar) rendered as individual boxed digits, IRD-style. */
function DigitBoxes({ value }: { value: string }) {
  const digits = value.replace(/\s+/g, "").split("");
  if (digits.length === 0) return <span className="text-[10px] text-black/40">—</span>;
  return (
    <div className="flex gap-[2px]">
      {digits.map((d, i) => (
        <span
          key={i}
          className="flex h-[16px] w-[14px] shrink-0 items-center justify-center rounded-[2px] border border-forest-deep bg-forest/[0.04] text-[9px] font-bold leading-none text-black"
        >
          {d}
        </span>
      ))}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1">
      <span className="shrink-0 font-semibold text-black/70">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function TotalRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-black/70">{label}</span>
      <span className="tabular-nums font-semibold">{value}</span>
    </div>
  );
}

/**
 * One full copy of the bill — a tall, narrow "docket" meant to sit within a
 * rotated half of a portrait A4 page (Original + Customer Copy, cut and
 * turned a quarter-turn to read), styled after a standard Nepali IRD
 * bill/tax-invoice layout: outer frame, boxed PAN digits, shaded table
 * header, words + totals split at the foot — reskinned in the brand's
 * forest palette instead of plain black/gray.
 */
export default function BillDocument({
  copyLabel,
  showBadge = true,
  padding = "px-3 py-3.5",
  invoiceNo,
  dateISO,
  payMode,
  company,
  customerName,
  customerPhone,
  customerAddress,
  customerPan,
  items,
  discount,
  deliveryFee,
}: BillDocumentProps) {
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.rate, 0);
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const blankRows = Math.max(0, 4 - items.length);

  return (
    <div className={cn("flex h-full flex-col text-[10px] text-black", padding)}>
      <div className="relative pb-4">
        {showBadge && (
          <span className="absolute left-0 top-0 shrink-0 rounded-full border border-forest-deep px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-black">
            {copyLabel}
          </span>
        )}

        <div className="absolute right-0 top-0 flex shrink-0 items-center gap-1">
          <span className="font-semibold text-black/70">PAN:</span>
          <DigitBoxes value={company.panNo} />
        </div>

        <div className="flex flex-col items-center pt-7 text-center">
          <Image
            src="/brand/logo-black.png"
            alt=""
            width={292}
            height={103}
            className="h-[52px] w-auto shrink-0 object-contain"
          />
          <p className="max-w-[85%] truncate pt-0.5 leading-snug">
            {company.address}
            {company.phone && ` · Ph: ${company.phone}`}
          </p>
          {company.email && <p className="max-w-[85%] truncate leading-snug">{company.email}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between py-1 leading-snug">
        <MetaRow label="Invoice No" value={invoiceNo} />
        <MetaRow label="Date" value={dateISO} />
      </div>

      <div className="grid flex-1" style={{ gridTemplateRows: "auto 1fr auto" }}>
        <div className="flex flex-col gap-1.5 border-b border-forest-deep py-2 leading-snug">
          <p className="text-[10.5px] font-bold uppercase tracking-wide text-black">
            Buyer Information
          </p>
          <div className="grid grid-cols-3 gap-x-2 gap-y-1.5">
            <p className="min-w-0">
              <span className="font-semibold text-black/70">Name: </span>
              {customerName || "—"}
            </p>
            {customerAddress && (
              <p className="min-w-0 break-words">
                <span className="font-semibold text-black/70">Address: </span>
                {customerAddress}
              </p>
            )}
            {customerPhone && (
              <p className="min-w-0">
                <span className="font-semibold text-black/70">Phone: </span>
                {customerPhone}
              </p>
            )}
            {customerPan && (
              <div className="col-span-2 flex items-center gap-1">
                <span className="font-semibold text-black/70">PAN:</span>
                <DigitBoxes value={customerPan} />
              </div>
            )}
            <p>
              <span className="font-semibold text-black/70">Pay Mode: </span>
              {payMode}
            </p>
          </div>
        </div>

        <div
          className="grid border-l border-r border-forest-deep text-[9px]"
          style={{ gridTemplateRows: `repeat(${1 + items.length + blankRows}, auto) 1fr` }}
        >
          <div
            className="grid border-b border-forest-deep bg-forest/10"
            style={{ gridTemplateColumns: "7% 12% 42% 13% 13% 13%" }}
          >
            <div className="border-r border-forest-deep px-1 py-1.5 text-center font-bold text-black">
              S.N.
            </div>
            <div className="border-r border-forest-deep px-1 py-1.5 text-center font-bold text-black">
              Batch
            </div>
            <div className="border-r border-forest-deep px-1.5 py-1.5 text-left font-bold text-black">
              Particulars
            </div>
            <div className="border-r border-forest-deep px-1 py-1.5 text-center font-bold text-black">
              Qty
            </div>
            <div className="border-r border-forest-deep px-1 py-1.5 text-center font-bold text-black">
              Rate
            </div>
            <div className="px-1.5 py-1.5 text-center font-bold text-black">Amount</div>
          </div>

          {items.map((item, idx) => (
            <div
              key={item.id}
              className="grid"
              style={{ gridTemplateColumns: "7% 12% 42% 13% 13% 13%" }}
            >
              <div className="border-r border-forest-deep px-1 py-1.5 text-center">{idx + 1}</div>
              <div className="border-r border-forest-deep px-1 py-1.5 text-center">{item.batchNo || "—"}</div>
              <div className="border-r border-forest-deep px-1.5 py-1.5">{item.particulars || "—"}</div>
              <div className="border-r border-forest-deep py-1.5 pl-1 pr-2 text-right tabular-nums">
                {item.qty}
              </div>
              <div className="border-r border-forest-deep py-1.5 pl-1 pr-2 text-right tabular-nums">
                {item.rate.toLocaleString("en-IN")}
              </div>
              <div className="py-1.5 pl-1.5 pr-2.5 text-right tabular-nums font-medium">
                {(item.qty * item.rate).toLocaleString("en-IN")}
              </div>
            </div>
          ))}

          {Array.from({ length: blankRows }).map((_, i) => (
            <div key={`blank-${i}`} className="grid" style={{ gridTemplateColumns: "7% 12% 42% 13% 13% 13%" }}>
              <div className="border-r border-forest-deep px-1 py-1.5">&nbsp;</div>
              <div className="border-r border-forest-deep px-1 py-1.5" />
              <div className="border-r border-forest-deep px-1.5 py-1.5" />
              <div className="border-r border-forest-deep px-1 py-1.5" />
              <div className="border-r border-forest-deep px-1 py-1.5" />
              <div className="px-1.5 py-1.5" />
            </div>
          ))}

          <div className="grid" style={{ gridTemplateColumns: "7% 12% 42% 13% 13% 13%" }}>
            <div className="border-r border-forest-deep" />
            <div className="border-r border-forest-deep" />
            <div className="border-r border-forest-deep" />
            <div className="border-r border-forest-deep" />
            <div className="border-r border-forest-deep" />
            <div />
          </div>
        </div>

        <div className="grid grid-cols-[74%_26%] border-b border-l border-r border-t border-forest-deep">
          <p className="border-r border-forest-deep p-2 italic leading-snug text-black/80">
            Amount in words: {total > 0 ? numberToWords(total) : "—"}
          </p>
          <div className="flex flex-col gap-1 p-2">
            <TotalRow label="Sub Total" value={formatPrice(subtotal)} />
            {discount > 0 && <TotalRow label="Discount" value={`-${formatPrice(discount)}`} />}
            <TotalRow label="Delivery" value={formatPrice(deliveryFee)} />
            <div className="mt-0.5 flex items-center justify-between border-t border-forest-deep pt-1">
              <span className="font-bold text-black">Total</span>
              <span className="tabular-nums font-bold text-black">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="pt-1 text-[9px] italic text-black/60">E.&amp;O.E.</p>

      <div className="mt-14 flex items-start justify-between gap-4">
        {payMode === "QR Payment" ? (
          <div className="-mt-9 text-[9px] leading-snug">
            <p className="font-bold uppercase tracking-wide text-black">Account Details</p>
            <p>
              <span className="font-semibold text-black/70">Account Name: </span>
              {FONEPAY.accountName}
            </p>
            <p>
              <span className="font-semibold text-black/70">Account Number: </span>
              {FONEPAY.accountNumber}
            </p>
            <p>
              <span className="font-semibold text-black/70">Bank Name: </span>
              {FONEPAY.bankName}
            </p>
          </div>
        ) : (
          <div />
        )}
        <div className="w-[28%] shrink-0 border-t border-forest-deep pt-1 text-center font-semibold text-black">
          Authorized Signature
        </div>
      </div>
    </div>
  );
}
