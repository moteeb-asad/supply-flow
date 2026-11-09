import { ImageResponse } from "next/og";
import { BrandMark } from "@/src/components/layout/brand-mark";

// Browser tab icon: the SupplyFlow mark (ink square, white cube).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandMark size={32} />, size);
}
