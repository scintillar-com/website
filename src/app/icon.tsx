import { ImageResponse } from "next/og";
import { BRAND, markDataUri } from "@/lib/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: BRAND.bg, borderRadius: 96 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={await markDataUri()} width={360} height={276} alt="" />
      </div>
    ),
    size,
  );
}
