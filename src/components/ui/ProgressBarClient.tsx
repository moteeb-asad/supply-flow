"use client";
import ProgressBar from "@/src/components/ui/ProgressBar";
import { useProgress } from "@/src/providers/ProgressProvider";

export default function ProgressBarClient() {
  const { loading } = useProgress();
  if (!loading) return null;
  return <ProgressBar />;
}
