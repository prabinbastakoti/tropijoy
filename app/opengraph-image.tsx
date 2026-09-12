import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Tropijoy — Pure Joy In Every Bite";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FRUITS = ["apple", "orange", "banana", "lemon", "pineapple"] as const;
const POUCH_W = 190;
const POUCH_H = 253;
/** row 1: apple, orange, banana — row 2: lemon, pineapple, nestled in the gaps below. */
const POUCH_POSITIONS = [
  { x: 0, y: 60, r: -8 },
  { x: 148, y: 40, r: 0 },
  { x: 296, y: 60, r: 8 },
  { x: 74, y: 250, r: -5 },
  { x: 222, y: 250, r: 6 },
];

async function toDataUri(relativePath: string) {
  const buf = await readFile(join(process.cwd(), relativePath));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export default async function Image() {
  const [logoSrc, fruitSrcs, semiBoldFont, boldFont, extraBoldFont] = await Promise.all([
    toDataUri("public/brand/logo-white.png"),
    Promise.all(FRUITS.map((f) => toDataUri(`public/products/${f}.png`))),
    readFile(join(process.cwd(), "public/fonts/Baloo2-SemiBold.ttf")),
    readFile(join(process.cwd(), "public/fonts/Baloo2-Bold.ttf")),
    readFile(join(process.cwd(), "public/fonts/Baloo2-ExtraBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #1A7D3E 0%, #116530 55%, #09381A 100%)",
          overflow: "hidden",
        }}
      >
        {/* soft glow behind the product stack */}
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -60,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />

        {/* left content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 0 0 64px",
            width: 620,
            height: "100%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori (the OG image renderer) requires plain <img> with data URIs; next/image isn't usable here. */}
          <img
            src={logoSrc}
            alt=""
            width={190}
            height={87}
            style={{ objectFit: "contain", marginBottom: 24 }}
          />
          <div
            style={{
              fontFamily: "Baloo 2",
              fontWeight: 800,
              fontSize: 56,
              lineHeight: 1.08,
              color: "#FFFFFF",
              display: "flex",
              flexWrap: "wrap",
              width: 520,
            }}
          >
            Pure joy in every bite.
          </div>
          <div
            style={{
              marginTop: 20,
              fontFamily: "Baloo 2",
              fontWeight: 600,
              fontSize: 23,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.75)",
              display: "flex",
              width: 470,
            }}
          >
            Real Nepali fruit, precision-sliced and dehydrated in small
            batches.
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            {["100% Natural", "No Added Sugar", "Made in Nepal"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.14)",
                  color: "#FAF8F5",
                  fontFamily: "Baloo 2",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* right product cluster — 3 pouches on top, 2 nestled below */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 60,
            top: "50%",
            transform: "translateY(-50%)",
            width: 296 + POUCH_W,
            height: 250 + POUCH_H,
          }}
        >
          {fruitSrcs.map((src, i) => (
            <div
              key={FRUITS[i]}
              style={{
                display: "flex",
                position: "absolute",
                left: POUCH_POSITIONS[i].x,
                top: POUCH_POSITIONS[i].y,
                width: POUCH_W,
                height: POUCH_H,
                transform: `rotate(${POUCH_POSITIONS[i].r}deg)`,
                filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.35))",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
              <img
                src={src}
                alt=""
                width={POUCH_W}
                height={POUCH_H}
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Baloo 2", data: semiBoldFont, weight: 600, style: "normal" },
        { name: "Baloo 2", data: boldFont, weight: 700, style: "normal" },
        { name: "Baloo 2", data: extraBoldFont, weight: 800, style: "normal" },
      ],
    }
  );
}
