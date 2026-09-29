import type { Metadata } from "next";
import AboutEditorial from "@/components/about/AboutEditorial";

export const metadata: Metadata = {
  title: "About — ANGEL WIRE",
};

export default function AboutPage() {
  return <AboutEditorial />;
}
