export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDocument {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export const BUSINESS = {
  name: "Tropijoy",
  email: "contact@tropijoynp.com",
  phone: "+977 9768530718",
  location: "Kathmandu, Nepal",
} as const;

export const termsDocument: LegalDocument = {
  title: "Terms & Conditions",
  updated: "2026-08-01",
  intro:
    "These terms govern your use of the Tropijoy website and any order you place through it. By browsing the site or placing an order you agree to them.",
  sections: [
    {
      heading: "1. Who we are",
      paragraphs: [
        `Tropijoy is a food business registered and operating in ${BUSINESS.location}, producing dehydrated fruit and freeze-dried fruit powders. You can reach us at ${BUSINESS.email} or ${BUSINESS.phone}.`,
      ],
    },
    {
      heading: "2. Placing an order",
      paragraphs: [
        "Submitting the checkout form is an offer to buy, not a completed contract. We confirm your order on the contact channel you nominate — WhatsApp, Email, Instagram, Telegram or phone — and the contract forms at that point.",
        "We may decline an order if an item is out of stock, if we cannot deliver to your address, or if we cannot verify the contact details provided.",
      ],
    },
    {
      heading: "3. Pricing and payment",
      paragraphs: [
        "All prices are in Nepali Rupees (NPR) and include applicable taxes. Delivery is charged at a flat Rs. 150 and is free on orders over Rs. 3,000.",
        "Payment is arranged when we confirm your order. We accept eSewa, Khalti, IME Pay, bank transfer, and cash on delivery within the Kathmandu Valley. We do not collect or store card details on this website.",
      ],
    },
    {
      heading: "4. Delivery",
      paragraphs: [
        "Delivery estimates are given in good faith but are not guaranteed. Courier coverage, weather and road conditions in Nepal can affect timelines, particularly during monsoon and major festivals.",
        "Risk in the goods passes to you on delivery to the address you provided.",
      ],
    },
    {
      heading: "5. Product information",
      paragraphs: [
        "Because we buy seasonally and do not blend batches to a fixed profile, colour, texture and flavour vary between harvests. This is a characteristic of the product, not a defect.",
        "Our products contain no added sugar, preservatives or colourings. They are produced in a facility that also handles tree nuts, so we cannot guarantee a nut-free product.",
      ],
      list: [
        "Nutrition figures are typical values and may vary by batch",
        "Shelf life is 9 months from packing when stored as directed",
        "Nothing on this site is medical advice",
      ],
    },
    {
      heading: "6. Returns and refunds",
      paragraphs: [
        "Unopened, undamaged pouches may be returned within 7 days of delivery for a full refund. Items that arrive damaged, spoiled or incorrect should be reported within 48 hours and will be replaced or refunded without return.",
        "For food safety reasons we cannot accept the return of opened pouches unless the product was faulty.",
      ],
    },
    {
      heading: "7. Your responsibilities",
      list: [
        "Provide accurate delivery and contact details",
        "Check the ingredients if you have an allergy or intolerance",
        "Do not use the site for unlawful purposes or attempt to disrupt it",
      ],
    },
    {
      heading: "8. Liability",
      paragraphs: [
        "Nothing in these terms limits our liability for death or personal injury caused by negligence, for fraud, or for any liability that cannot lawfully be excluded.",
        "Otherwise our liability in connection with any order is limited to the value of that order.",
      ],
    },
    {
      heading: "9. Changes and governing law",
      paragraphs: [
        "We may update these terms; the version in force is the one published here at the time you order.",
        "These terms are governed by the laws of Nepal, and the courts of Kathmandu have exclusive jurisdiction.",
      ],
    },
  ],
};

export const privacyDocument: LegalDocument = {
  title: "Privacy Policy",
  updated: "2026-08-01",
  intro:
    "This policy explains what personal information Tropijoy collects, why we collect it, and what we do with it. We collect as little as we can get away with.",
  sections: [
    {
      heading: "1. What we collect",
      list: [
        "Your name and delivery address, so we can send your order",
        "Your chosen contact handle — phone number, email, or social username — so we can confirm the order",
        "Order contents and totals",
        "Your email address, if you subscribe to our newsletter",
      ],
      paragraphs: [
        "We do not collect card or banking details through this website. Payment is arranged separately once we contact you.",
      ],
    },
    {
      heading: "2. Information stored in your browser",
      paragraphs: [
        "Your cart, wishlist, order history and any reviews you write are stored in your own browser using localStorage. This data stays on your device — it is not transmitted to us and we cannot read it.",
        "Clearing your browser data will erase your local order history. It does not affect orders we have already received and confirmed.",
      ],
    },
    {
      heading: "3. Why we use it",
      list: [
        "To confirm, prepare and deliver your order",
        "To contact you about that order on the channel you chose",
        "To respond to enquiries and support requests",
        "To send occasional updates, only if you opted in",
      ],
    },
    {
      heading: "4. Who we share it with",
      paragraphs: [
        "We share your name, address and phone number with the courier delivering your parcel — that is the only routine sharing we do.",
        "We use Resend to send transactional email. We do not sell, rent or trade your personal information to anyone, ever.",
      ],
    },
    {
      heading: "5. How long we keep it",
      paragraphs: [
        "Order records are kept for as long as we need them for tax and accounting purposes under Nepali law. Newsletter subscriptions are kept until you unsubscribe.",
      ],
    },
    {
      heading: "6. Your rights",
      list: [
        "Ask what personal information we hold about you",
        "Ask us to correct anything inaccurate",
        "Ask us to delete your information, where we are not required to keep it",
        "Unsubscribe from marketing at any time",
      ],
      paragraphs: [
        `To exercise any of these, email ${BUSINESS.email}. We will respond within 30 days.`,
      ],
    },
    {
      heading: "7. Security",
      paragraphs: [
        "The site is served over HTTPS and we keep personal information to a minimum. No system is perfectly secure, but collecting less is the most reliable protection we can offer.",
      ],
    },
    {
      heading: "8. Contact",
      paragraphs: [
        `Questions about this policy: ${BUSINESS.email} or ${BUSINESS.phone}, ${BUSINESS.location}.`,
      ],
    },
  ],
};

export const shippingPolicyDocument: LegalDocument = {
  title: "Shipping Policy",
  updated: "2026-08-01",
  intro:
    "Where we deliver, how long it takes, and what it costs.",
  sections: [
    {
      heading: "Delivery areas and timing",
      list: [
        "Kathmandu Valley — 24–48 hours",
        "Pokhara, Chitwan, Butwal, Biratnagar and other major cities — 2–4 working days",
        "Remote districts, via local couriers — up to 7 working days, subject to courier coverage",
      ],
      paragraphs: [
        "Estimates run from the moment your order is confirmed, not from when it is submitted. Monsoon weather and festival periods can add time.",
      ],
    },
    {
      heading: "Delivery charges",
      paragraphs: [
        "A flat Rs. 150 anywhere in Nepal. Free on orders over Rs. 3,000 — our free-shipping threshold. The charge is shown in your cart before you check out.",
      ],
    },
    {
      heading: "How your order is packed",
      paragraphs: [
        "Every product ships in a nitrogen-flushed, resealable pouch with a silica sachet, inside a waterproof outer. This is deliberately over-specified for monsoon conditions.",
      ],
    },
    {
      heading: "International orders",
      paragraphs: [
        "We do not ship outside Nepal yet. Dried fruit is subject to agricultural import rules that differ by country, and we would rather not sell you something that gets held at customs. India and the Gulf are on our list.",
      ],
    },
  ],
};

export const returnsPolicyDocument: LegalDocument = {
  title: "Returns & Refund Guarantee",
  updated: "2026-08-01",
  intro:
    "What happens if something arrives damaged, missing, or just isn't right — our food-quality refund guarantee.",
  sections: [
    {
      heading: "Our refund guarantee",
      paragraphs: [
        "If you're not happy with the quality of what arrives, we'll make it right — a replacement or a refund, whichever you'd prefer. This applies to payments made via eSewa, Khalti, card, or cash on delivery.",
      ],
    },
    {
      heading: "Returns",
      list: [
        "Unopened and undamaged — return within 7 days for a full refund",
        "Damaged, spoiled or incorrect — report within 48 hours for a replacement or refund, no return needed",
        "Missing packages — report within 48 hours of the expected delivery date and we'll trace it with the courier or replace it",
        "Opened pouches cannot be returned unless the product was faulty, for food safety reasons",
      ],
    },
    {
      heading: "Refunds",
      paragraphs: [
        "Refunds are issued to the original payment method within 5–7 working days of us agreeing the return. eSewa, Khalti and card payments are refunded directly to the source; cash-on-delivery orders are refunded via eSewa, Khalti or bank transfer.",
      ],
    },
    {
      heading: "Starting a return",
      paragraphs: [
        `Reply on the channel we used to confirm your order, or email ${BUSINESS.email} with your order number and a photo if the item arrived damaged. There is no form to fill in.`,
      ],
    },
  ],
};

export const storageGuideDocument: LegalDocument = {
  title: "Storage & Shelf Life Guide",
  updated: "2026-08-01",
  intro:
    "How to keep your pouches at their best — no additives means storage matters more, not less.",
  sections: [
    {
      heading: "Shelf life",
      paragraphs: [
        "Unopened pouches keep for 6–12 months from the pack date printed on the label, thanks to our nitrogen-flushed, resealable packaging and silica sachet.",
        "Once opened, we recommend finishing a pouch within 4–6 weeks for the best texture and flavour.",
      ],
    },
    {
      heading: "Keep pouches sealed",
      paragraphs: [
        "Press the air out and reseal the zip fully after every use. The resealable pouch is designed to keep moisture and air out between uses — a loosely closed pouch is the single biggest cause of premature softening.",
      ],
    },
    {
      heading: "Protect from humidity and sunlight",
      list: [
        "Store in a cool, dry cupboard — not the fridge, which introduces condensation",
        "Keep out of direct sunlight, which fades colour and degrades flavour over time",
        "Avoid steamy spots like right above the stove or a kettle",
      ],
    },
    {
      heading: "Signs it's time to toss it",
      paragraphs: [
        "Because there are no preservatives, trust your senses: if a pouch smells off, feels unusually soft and damp, or shows any mould, don't eat it.",
      ],
    },
  ],
};

export const qualitySafetyDocument: LegalDocument = {
  title: "Quality & Safety Standards",
  updated: "2026-08-01",
  intro:
    "How every pouch is processed, and the standards we hold ourselves to before anything is sealed.",
  sections: [
    {
      heading: "Hygienic processing",
      paragraphs: [
        "Fruit is washed and processed in a sanitary facility before slicing begins. Work surfaces and equipment are cleaned between batches, and staff follow basic food-hygiene practice throughout.",
      ],
    },
    {
      heading: "Precision machine-slicing",
      paragraphs: [
        "Every slice is cut by machine to a consistent thickness, so drying is even and texture is consistent pouch to pouch — no ragged, unevenly-dried pieces.",
      ],
    },
    {
      heading: "Food compliance",
      paragraphs: [
        "Our products are processed in line with DFTQC (Department of Food Technology and Quality Control) Nepal standards for food safety and labelling.",
      ],
    },
    {
      heading: "Zero sulphites, zero shortcuts",
      list: [
        "No added sugar, preservatives, or artificial colouring in any product",
        "No sulphites used in processing or packing",
        "One ingredient on the label — the fruit itself",
      ],
    },
    {
      heading: "Sanitary facility standards",
      paragraphs: [
        "Dehydration happens at controlled low temperatures, and packing takes place in a clean, pest-controlled environment within 48 hours of drying, sealed while still at peak freshness.",
      ],
    },
  ],
};

export const cookiesDocument: LegalDocument = {
  title: "Cookie Policy",
  updated: "2026-08-01",
  intro:
    "What we store in your browser, why, and how to control it. Short version: nothing invasive, and most of it is your own data, not ours.",
  sections: [
    {
      heading: "1. We don't use tracking or advertising cookies",
      paragraphs: [
        "This site doesn't run third-party ad trackers, analytics pixels, or cross-site cookies. We're a small team shipping dried fruit, not an ad business.",
      ],
    },
    {
      heading: "2. What is stored in your browser",
      list: [
        "Your cart, wishlist, order history and any reviews you write — via localStorage, so this data lives on your device",
        "A session flag noting you've seen the site this tab — via sessionStorage, cleared when you close the tab",
        "Your cookie-notice preference, if we show one",
      ],
      paragraphs: [
        "None of this is a tracking cookie in the advertising sense — it's functional storage that makes the cart and wishlist work without an account.",
      ],
    },
    {
      heading: "3. Controlling it",
      paragraphs: [
        "Clear your browser's site data for tropijoynp.com at any time to remove all of the above. Doing so will empty your cart and wishlist and clear your local order history — it does not cancel or affect orders we've already confirmed.",
      ],
    },
    {
      heading: "4. Changes",
      paragraphs: [
        "If that ever changes — for example if we add analytics — we'll update this page and the date above.",
      ],
    },
  ],
};

export const accessibilityDocument: LegalDocument = {
  title: "Accessibility Statement",
  updated: "2026-08-01",
  intro:
    "We want this site to be usable by everyone, including people using screen readers, keyboard navigation, or browsing with reduced motion. Here's where we stand.",
  sections: [
    {
      heading: "1. What we've done",
      list: [
        "Semantic HTML and labelled form fields throughout checkout, search and reviews",
        "Visible keyboard focus states on every interactive element",
        "Motion and animation are reduced or skipped when your system's 'reduce motion' setting is on",
        "Colour choices checked for reasonable contrast against our cream and white backgrounds",
      ],
    },
    {
      heading: "2. Known gaps",
      paragraphs: [
        "We're a small team and this is an ongoing process, not a finished checklist. Some third-party embeds (like payment confirmation flows once we integrate real payment) may not fully match this standard on day one.",
      ],
    },
    {
      heading: "3. Tell us what's not working",
      paragraphs: [
        `If something on this site is difficult to use with assistive technology, we want to know. Email ${BUSINESS.email} with what you were trying to do and what happened — we treat these reports as bugs, not feedback for a backlog.`,
      ],
    },
  ],
};
