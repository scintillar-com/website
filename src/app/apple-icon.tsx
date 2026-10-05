import { ImageResponse } from "next/og";
import { BRAND, markDataUri } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: BRAND.bg }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={await markDataUri()} width={124} height={95} alt="" />
      </div>
    ),
    size,
  );
}
