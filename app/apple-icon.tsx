import { ImageResponse } from "next/og";
import { BrandMark } from "@/src/components/layout/brand-mark";

// Home screen icon on iOS (180x180).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandMark size={180} />, size);
}
