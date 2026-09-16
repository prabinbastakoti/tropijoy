"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  Building2,
  ChevronDown,
  Package,
  Plus,
  Receipt,
  Save,
  Trash2,
  User,
} from "lucide-react";
import ProductCombobox, { type ProductOption } from "@/components/bill/ProductCombobox";
import BillDocument, { type BillLineItem } from "@/components/bill/BillDocument";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import { useBillStore } from "@/store/bill-store";
import { useBillDraftStore, EMPTY_DRAFT_FIELDS } from "@/store/bill-draft-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn, formatPrice, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_RATE } from "@/lib/utils";
import batchesData from "@/data/batches.json";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const PAY_MODES = ["Cash", "QR Payment"];
const BATCHES = batchesData as string[];

let idSeq = 0;
function nextId(): string {
  idSeq += 1;
  return `li-${Date.now()}-${idSeq}`;
}

const inputClass =
  "w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest/30";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-forest-ink/50 mb-1 block";

export default function BillPrintPage() {
  const hydrated = useHydrated();
  const nextInvoiceNo = useBillStore((s) => s.nextInvoiceNo);
  const company = useBillStore((s) => s.company);
  const setCompany = useBillStore((s) => s.setCompany);
  const commitInvoiceNo = useBillStore((s) => s.commitInvoiceNo);

  const invoiceNo = useBillDraftStore((s) => s.invoiceNo);
  const date = useBillDraftStore((s) => s.date);
  const customerName = useBillDraftStore((s) => s.customerName);
  const customerPhone = useBillDraftStore((s) => s.customerPhone);
  const customerAddress = useBillDraftStore((s) => s.customerAddress);
  const customerPan = useBillDraftStore((s) => s.customerPan);
  const payMode = useBillDraftStore((s) => s.payMode);
  const items = useBillDraftStore((s) => s.items);
  const discount = useBillDraftStore((s) => s.discount);
  const setDraft = useBillDraftStore((s) => s.setDraft);

  const [companyPanelOpen, setCompanyPanelOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Keyboard flow: Customer Name auto-focuses on load, then Enter walks
  // down Name -> Phone -> PAN -> Address -> product search, instead of
  // submitting the form (which would otherwise pop the preview open).
  const businessPanRef = useRef<HTMLInputElement>(null);
  const businessPhoneRef = useRef<HTMLInputElement>(null);
  const businessAddressRef = useRef<HTMLInputElement>(null);
  const businessEmailRef = useRef<HTMLInputElement>(null);
  const invoiceNoRef = useRef<HTMLInputElement>(null);
  const dateTriggerRef = useRef<HTMLButtonElement>(null);
  const payModeTriggerRef = useRef<HTMLButtonElement>(null);
  const customerNameRef = useRef<HTMLInputElement>(null);
  const customerPhoneRef = useRef<HTMLInputElement>(null);
  const customerPanRef = useRef<HTMLInputElement>(null);
  const customerAddressRef = useRef<HTMLInputElement>(null);
  const productSearchRef = useRef<HTMLInputElement>(null);
  const itemsSectionRef = useRef<HTMLElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  function focusNext(ref: React.RefObject<HTMLInputElement | null>) {
    return (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
  }

  // Per-row field refs for the items table, keyed by item id — lets Enter
  // walk Batch -> Particulars -> Qty -> Rate -> next row's Batch, and on the
  // last row, Rate -> Discount -> Preview Bill, instead of doing nothing (or
  // submitting the form) once there's nowhere left for Enter to go.
  const rowRefs = useRef<
    Record<string, { batch: HTMLButtonElement | null; particulars: HTMLInputElement | null; qty: HTMLInputElement | null; rate: HTMLInputElement | null }>
  >({});
  const discountRef = useRef<HTMLInputElement>(null);

  function getRowRef(id: string) {
    if (!rowRefs.current[id]) {
      rowRefs.current[id] = { batch: null, particulars: null, qty: null, rate: null };
    }
    return rowRefs.current[id];
  }

  function focusNextInRow<T extends HTMLElement>(
    getTarget: () => HTMLElement | null | undefined
  ) {
    return (e: React.KeyboardEvent<T>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        getTarget()?.focus();
      }
    };
  }
  // Lets qty/rate/discount inputs sit visually empty while the user is
  // clearing/retyping them, instead of snapping to "0" on every keystroke.
  // The store still gets 0 immediately (so totals stay correct); the raw
  // text is only forgotten (reverting the field to the store value) on blur.
  const [rawInputs, setRawInputs] = useState<Record<string, string>>({});

  function displayValue(key: string, storeValue: number): string {
    return key in rawInputs ? rawInputs[key] : String(storeValue);
  }

  function setRaw(key: string, v: string) {
    setRawInputs((prev) => ({ ...prev, [key]: v }));
  }

  function clearRaw(key: string) {
    setRawInputs((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  // First-ever load only: the persisted draft starts with empty invoiceNo/date,
  // so fill them in once hydration completes. Any later edit (including
  // clearing the field) is never overwritten, since this only fires while
  // the value is still blank.
  useEffect(() => {
    if (!hydrated) return;
    const patch: { invoiceNo?: string; date?: string } = {};
    if (!invoiceNo && nextInvoiceNo) patch.invoiceNo = nextInvoiceNo;
    if (!date) patch.date = todayISO();
    if (Object.keys(patch).length > 0) setDraft(patch);
  }, [hydrated, invoiceNo, date, nextInvoiceNo, setDraft]);

  useEffect(() => {
    if (!hydrated) return;
    payModeTriggerRef.current?.focus();
  }, [hydrated]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.rate, 0),
    [items]
  );
  const deliveryFee = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  function addFromCatalog(option: ProductOption) {
    setDraft({
      items: [
        {
          id: nextId(),
          particulars: `${option.name} (${option.variant})`,
          batchNo: BATCHES[0],
          qty: 1,
          rate: option.price,
        },
        ...items,
      ],
    });
  }

  function addCustomRow() {
    setDraft({
      items: [{ id: nextId(), particulars: "", batchNo: BATCHES[0], qty: 1, rate: 0 }, ...items],
    });
  }

  function updateItem(id: string, patch: Partial<BillLineItem>) {
    setDraft({ items: items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  }

  function removeItem(id: string) {
    setDraft({ items: items.filter((i) => i.id !== id) });
  }

  const resetForm = useCallback(
    (newInvoiceNo: string) => {
      setDraft({ invoiceNo: newInvoiceNo, date: todayISO(), ...EMPTY_DRAFT_FIELDS });
    },
    [setDraft]
  );

  function handlePreviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPreviewOpen(true);
  }

  const handleSaveAndNext = useCallback(() => {
    const usedNo = invoiceNo.trim() || nextInvoiceNo;
    commitInvoiceNo(usedNo);
    const upcoming = useBillStore.getState().nextInvoiceNo;
    resetForm(upcoming);
    toast.success(`Bill ${usedNo} saved. Next bill: ${upcoming}`);
    requestAnimationFrame(() => payModeTriggerRef.current?.focus());
  }, [invoiceNo, nextInvoiceNo, commitInvoiceNo, resetForm]);

  // Fires once the OS print dialog is dismissed — printed or cancelled,
  // there's no way to tell them apart — so the preview doesn't just sit
  // there behind it, and the bill rolls over to the next one right away.
  useEffect(() => {
    if (!previewOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setPreviewOpen(false);
      if (e.key === "Enter") {
        e.preventDefault();
        window.print();
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        previewScrollRef.current?.scrollBy({
          top: e.key === "ArrowDown" ? 80 : -80,
          behavior: "smooth",
        });
      }
    }
    function onAfterPrint() {
      setPreviewOpen(false);
      handleSaveAndNext();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, [previewOpen, handleSaveAndNext]);

  function handleClear() {
    resetForm(invoiceNo);
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => payModeTriggerRef.current?.focus());
  }

  const docProps = {
    invoiceNo: invoiceNo || "—",
    dateISO: date,
    payMode,
    company,
    customerName,
    customerPhone,
    customerAddress,
    customerPan,
    items,
    discount,
    deliveryFee,
  };

  return (
    <div id="bill-print-page-root" className="-mt-20 min-h-screen bg-sage/40 pb-20">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #bill-print-page-root {
            /* margin-top (a negative offset) is left untouched here — it cancels
               out the site layout's 80px header spacer above <main>, which is
               still reserved during print since Header itself renders null. */
            padding-bottom: 0 !important;
            min-height: 0 !important;
            background: #fff !important;
          }
          #bill-print-page-root > div {
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
          }
          #bill-print-preview { margin-top: 0 !important; }
          #bill-print-area { box-shadow: none !important; margin: 0 !important; }
          @page { size: A4; margin: 0; }
        }
        /* The print-accurate (rotated, two-copy) layout stays fully rendered
           for print/PDF capture but is moved off-screen for normal viewing —
           the simplified A5 preview above is what people actually look at. */
        @media screen {
          #bill-print-preview {
            position: absolute;
            left: -99999px;
            top: 0;
          }
        }
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <div className="no-print sticky top-0 z-20 -mx-4 flex flex-wrap items-end justify-between gap-4 bg-[#F3F5F1] px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-forest/70">
              Internal Tool
            </p>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-deep">
              Bill Print
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-full border-2 border-forest/20 px-4 py-2.5 text-sm font-semibold text-forest-deep hover:bg-forest/5 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSaveAndNext}
              className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-light transition-colors shadow-lift"
            >
              <Save size={16} />
              Save &amp; Next Bill
            </button>
          </div>
        </div>

        {!hydrated ? (
          <div className="space-y-4">
            <div className="skeleton h-40 rounded-3xl" />
            <div className="skeleton h-64 rounded-3xl" />
          </div>
        ) : (
          <div id="bill-print-body" className="space-y-6">
            {/* editor */}
            <form
              onSubmit={handlePreviewSubmit}
              className="no-print space-y-4 max-w-6xl mx-auto w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <section className="bg-white rounded-2xl border border-forest/10 p-4">
                <button
                  type="button"
                  onClick={() => setCompanyPanelOpen((v) => !v)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <h2 className="flex items-center gap-2 font-display font-bold text-forest-deep">
                    <Building2 size={17} className="text-forest" />
                    Business Details
                  </h2>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "text-forest-ink/50 transition-transform",
                      companyPanelOpen && "rotate-180"
                    )}
                  />
                </button>
                {companyPanelOpen && (
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    <div>
                      <label className={labelClass}>Business Name</label>
                      <p className="px-3.5 py-2.5 font-display text-base font-bold text-forest-deep">
                        {company.name}
                      </p>
                    </div>
                    <div>
                      <label className={labelClass}>PAN No.</label>
                      <input
                        ref={businessPanRef}
                        value={company.panNo}
                        onChange={(e) => setCompany({ ...company, panNo: e.target.value })}
                        onKeyDown={focusNextInRow(() => businessPhoneRef.current)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input
                        ref={businessPhoneRef}
                        value={company.phone}
                        onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                        onKeyDown={focusNextInRow(() => businessAddressRef.current)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Address</label>
                      <input
                        ref={businessAddressRef}
                        value={company.address}
                        onChange={(e) => setCompany({ ...company, address: e.target.value })}
                        onKeyDown={focusNextInRow(() => businessEmailRef.current)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        ref={businessEmailRef}
                        value={company.email}
                        onChange={(e) => setCompany({ ...company, email: e.target.value })}
                        onKeyDown={focusNextInRow(() => invoiceNoRef.current)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-white rounded-2xl border border-forest/10 p-4">
                <h2 className="flex items-center gap-2 font-display font-bold text-forest-deep mb-3">
                  <Receipt size={17} className="text-forest" />
                  Bill Details
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className={labelClass}>Bill / Invoice No.</label>
                    <input
                      ref={invoiceNoRef}
                      value={invoiceNo}
                      onChange={(e) => setDraft({ invoiceNo: e.target.value })}
                      onKeyDown={focusNextInRow(() => dateTriggerRef.current)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Date</label>
                    <DatePicker
                      ref={dateTriggerRef}
                      value={date}
                      onChange={(iso) => setDraft({ date: iso })}
                      onDone={() => payModeTriggerRef.current?.focus()}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Pay Mode</label>
                    <Select value={payMode} onValueChange={(v) => setDraft({ payMode: v })}>
                      <SelectTrigger
                        ref={payModeTriggerRef}
                        className="w-full justify-between rounded-xl px-3.5 py-2.5"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        onCloseAutoFocus={(e) => {
                          // Radix's default is to return focus to the
                          // trigger — send it on to Customer Name instead.
                          e.preventDefault();
                          customerNameRef.current?.focus();
                        }}
                      >
                        {PAY_MODES.map((mode) => (
                          <SelectItem
                            key={mode}
                            value={mode}
                            className="border-l-2 border-transparent data-[highlighted]:border-forest data-[highlighted]:bg-forest/15"
                          >
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-forest/10 p-4">
                <h2 className="flex items-center gap-2 font-display font-bold text-forest-deep mb-3">
                  <User size={17} className="text-forest" />
                  Customer
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      ref={customerNameRef}
                      value={customerName}
                      onChange={(e) => setDraft({ customerName: e.target.value })}
                      onKeyDown={focusNext(customerPhoneRef)}
                      placeholder="Customer name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      ref={customerPhoneRef}
                      value={customerPhone}
                      onChange={(e) => setDraft({ customerPhone: e.target.value })}
                      onKeyDown={focusNext(customerPanRef)}
                      placeholder="98XXXXXXXX"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>PAN No. (optional)</label>
                    <input
                      ref={customerPanRef}
                      value={customerPan}
                      onChange={(e) => setDraft({ customerPan: e.target.value })}
                      onKeyDown={focusNext(customerAddressRef)}
                      placeholder="For business buyers"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <input
                      ref={customerAddressRef}
                      value={customerAddress}
                      onChange={(e) => setDraft({ customerAddress: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          productSearchRef.current?.focus();
                          itemsSectionRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                      placeholder="Customer address"
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>
              </div>

              <section
                ref={itemsSectionRef}
                className="bg-white rounded-2xl border border-forest/10 p-4"
              >
                <h2 className="flex items-center gap-2 font-display font-bold text-forest-deep mb-3">
                  <Package size={17} className="text-forest" />
                  Items
                </h2>
                <ProductCombobox
                  ref={productSearchRef}
                  onSelect={addFromCatalog}
                  onEnterWhileClosed={() => {
                    if (items[0]) getRowRef(items[0].id).batch?.focus();
                  }}
                />

                <div className="mt-4 space-y-2">
                  {items.length === 0 && (
                    <p className="text-sm text-forest-ink/50 py-4 text-center">
                      No items yet — search a product above or add a custom line.
                    </p>
                  )}
                  {items.length > 0 && (
                    <div className="grid grid-cols-[24px_110px_1fr_80px_100px_110px_36px] gap-2 px-2.5 text-[11px] font-semibold uppercase tracking-wide text-forest-ink/40">
                      <span />
                      <span>Batch</span>
                      <span>Particulars</span>
                      <span className="text-right">Qty</span>
                      <span className="text-right">Rate</span>
                      <span className="pr-1 text-right">Total</span>
                      <span />
                    </div>
                  )}
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[24px_110px_1fr_80px_100px_110px_36px] gap-2 items-center bg-cream/60 rounded-xl px-2.5 py-2"
                    >
                      <span className="text-xs font-semibold text-forest-ink/40 text-center tabular-nums">
                        {idx + 1}
                      </span>
                      <Select
                        value={item.batchNo}
                        onValueChange={(v) => updateItem(item.id, { batchNo: v })}
                      >
                        <SelectTrigger
                          ref={(el) => {
                            getRowRef(item.id).batch = el;
                          }}
                          className="grid w-full grid-cols-[1fr_auto] items-center gap-1 rounded-lg px-1.5 py-2 text-sm text-center [&>span]:text-center"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          onCloseAutoFocus={(e) => {
                            // Radix's default here is to return focus to the
                            // trigger — override it so closing (by picking a
                            // batch) hands focus straight to Particulars.
                            e.preventDefault();
                            getRowRef(item.id).particulars?.focus();
                          }}
                        >
                          {BATCHES.map((batch) => (
                            <SelectItem
                              key={batch}
                              value={batch}
                              className="border-l-2 border-transparent data-[highlighted]:border-forest data-[highlighted]:bg-forest/15"
                            >
                              {batch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input
                        ref={(el) => {
                          getRowRef(item.id).particulars = el;
                        }}
                        value={item.particulars}
                        onChange={(e) => updateItem(item.id, { particulars: e.target.value })}
                        onKeyDown={focusNextInRow(() => getRowRef(item.id).qty)}
                        placeholder="Particulars"
                        className="rounded-lg border border-forest/15 bg-white px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                      />
                      <input
                        ref={(el) => {
                          getRowRef(item.id).qty = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        value={displayValue(`${item.id}-qty`, item.qty)}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^\d*$/.test(v)) {
                            setRaw(`${item.id}-qty`, v);
                            updateItem(item.id, { qty: v === "" ? 0 : Number(v) });
                          }
                        }}
                        onKeyDown={focusNextInRow(() => getRowRef(item.id).rate)}
                        onBlur={() => clearRaw(`${item.id}-qty`)}
                        className="rounded-lg border border-forest/15 bg-white px-2 py-2 text-sm text-right outline-none focus:ring-2 focus:ring-forest/30"
                      />
                      <input
                        ref={(el) => {
                          getRowRef(item.id).rate = el;
                        }}
                        type="text"
                        inputMode="decimal"
                        value={displayValue(`${item.id}-rate`, item.rate)}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^\d*\.?\d*$/.test(v)) {
                            setRaw(`${item.id}-rate`, v);
                            updateItem(item.id, { rate: v === "" ? 0 : Number(v) });
                          }
                        }}
                        onKeyDown={focusNextInRow(() =>
                          idx + 1 < items.length ? getRowRef(items[idx + 1].id).batch : discountRef.current
                        )}
                        onBlur={() => clearRaw(`${item.id}-rate`)}
                        className="rounded-lg border border-forest/15 bg-white px-2 py-2 text-sm text-right outline-none focus:ring-2 focus:ring-forest/30"
                      />
                      <p className="text-sm font-semibold text-forest-deep text-right pr-1 tabular-nums">
                        {formatPrice(item.qty * item.rate)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addCustomRow}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-forest-light"
                >
                  <Plus size={16} /> Add custom item
                </button>

                <div className="mt-5 pt-4 border-t border-forest/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-forest-ink/60">Discount (Rs.)</label>
                    <input
                      ref={discountRef}
                      type="text"
                      inputMode="decimal"
                      value={displayValue("discount", discount)}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^\d*\.?\d*$/.test(v)) {
                          setRaw("discount", v);
                          setDraft({ discount: v === "" ? 0 : Number(v) });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setPreviewOpen(true);
                        }
                      }}
                      onBlur={() => clearRaw("discount")}
                      className="w-28 rounded-lg border border-forest/15 px-2.5 py-2 text-sm text-right outline-none focus:ring-2 focus:ring-forest/30"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-forest-ink/50">Subtotal: {formatPrice(subtotal)}</p>
                    {discount > 0 && (
                      <p className="text-xs text-forest-ink/50">Discount: -{formatPrice(discount)}</p>
                    )}
                    <p className="text-xs text-forest-ink/50">
                      Delivery Fee: {formatPrice(deliveryFee)}
                      {deliveryFee === 0 && " (free over Rs. 3,000)"}
                    </p>
                    <p className="text-lg font-bold text-forest-deep">
                      Total: {formatPrice(total)}
                    </p>
                  </div>
                </div>
              </section>
            </form>

            {/* on-screen reading preview — one copy, upright, A5. Purely a
                screen convenience for proofreading; printing still uses the
                full print-accurate layout further down, untouched. Hidden
                until the user asks for it (Preview Bill button, or Enter in
                any form field), then shown centered over the whole page —
                billing-software style: fill the form, then review before
                printing. */}
            {previewOpen &&
              createPortal(
                // Portalled straight onto <body>: PageTransition wraps every
                // page in a framer-motion <motion.div>, which (even at rest)
                // carries a CSS transform — that makes it the containing
                // block for any `position: fixed` descendant, so the
                // backdrop was only covering from motion.div's own box down,
                // not the true viewport top. Escaping via a portal fixes it.
                <div
                  className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                  onClick={() => setPreviewOpen(false)}
                >
                  <div
                    className="relative flex max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-lift"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div ref={previewScrollRef} className="overflow-auto no-scrollbar">
                      <div className="bg-white mx-auto" style={{ width: "148mm", height: "210mm" }}>
                        <BillDocument
                          copyLabel=""
                          showBadge={false}
                          padding="px-8 py-10"
                          {...docProps}
                        />
                      </div>
                    </div>
                  </div>
                </div>,
                document.body
              )}

            {/* preview */}
            <div id="bill-print-preview">
              <div className="overflow-x-auto">
                <div
                  id="bill-print-area"
                  className="flex flex-col justify-center bg-white shadow-lift mx-auto"
                  style={{ width: "210mm", minHeight: "297mm", padding: "10mm", boxSizing: "border-box" }}
                >
                  <div className="flex flex-col">
                    <div
                      className="relative overflow-hidden"
                      style={{ width: "190mm", height: "127mm" }}
                    >
                      <div
                        className="absolute flex flex-col"
                        style={{
                          // Matches the slot exactly (swapped, since rotated) —
                          // the bill fills its half edge to edge.
                          width: "127mm",
                          height: "190mm",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%) rotate(90deg)",
                        }}
                      >
                        <BillDocument copyLabel="Original" {...docProps} />
                      </div>
                    </div>

                    <div className="flex items-center" style={{ height: "23mm" }}>
                      <span className="flex-1 border-t border-dashed border-[#999]" />
                    </div>

                    <div
                      className="relative overflow-hidden"
                      style={{ width: "190mm", height: "127mm" }}
                    >
                      <div
                        className="absolute flex flex-col"
                        style={{
                          // Matches the slot exactly (swapped, since rotated) —
                          // the bill fills its half edge to edge.
                          width: "127mm",
                          height: "190mm",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%) rotate(90deg)",
                        }}
                      >
                        <BillDocument copyLabel="Customer Copy" {...docProps} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
