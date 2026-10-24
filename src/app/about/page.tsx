import { AboutCodeRxView } from "@/components/common/AboutCodeRxView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — CodeRx Healthcare OS",
  description:
    "CodeRx aims to simplify healthcare by connecting patients and doctors through one secure, easy-to-use platform.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#070D13] flex items-center justify-center p-4 sm:p-8">
      <AboutCodeRxView isModal={false} />
    </main>
  );
}
