import type { Metadata } from "next";
import About from "@/components/About";
import Footer from "@/components/Footer";

const title = "About — Verde Noir";
const description = "A shop for people who read the leaf before the calendar.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

export default function AboutPage() {
  return (
    <main>
      <About />
      <Footer />
    </main>
  );
}
