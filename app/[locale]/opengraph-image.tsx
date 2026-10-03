import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { locales } from "@/lib/i18n";

export const alt = `${siteConfig.name} — Premium Car Rental in Egypt`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Latin text only: the default OG font has no Arabic glyphs, so both locales share this card.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "radial-gradient(circle at 80% 20%, #3a2f1c 0%, #0b0b0c 60%)", color: "#f2efe9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, color: "#c9a96e", fontSize: 26, letterSpacing: 8 }}>
          <div style={{ width: 18, height: 18, background: "#c9a96e", transform: "rotate(45deg)" }} />
          PREMIUM CAR RENTAL · EGYPT
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, letterSpacing: 10, textTransform: "uppercase" }}>{siteConfig.name}</div>
          <div style={{ fontSize: 38, color: "#a39e94", marginTop: 20 }}>Mercedes-Benz · BMW · Audi · Lexus · Range Rover</div>
        </div>
      </div>
    ),
    size,
  );
}
