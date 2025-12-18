import Footer from "@/components/Footer";
import Header from "@/components/staff/Header";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="pt-24">{children}</main>
            <Footer />
        </>
    );
}
