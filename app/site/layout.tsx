//import Header from "./components/Header";
import Header from "@/app/site/(patient)/components/Header";
import FooterSection from "@/app/site/(patient)/components/FooterSection";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <FooterSection />
    </>
  );
}
