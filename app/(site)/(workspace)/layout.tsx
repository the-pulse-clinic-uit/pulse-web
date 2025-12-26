import PatientHeader from "@/components/patient/PatientHeader";
import AuthGuard from "@/components/AuthGuard";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <PatientHeader />
            <main>{children}</main>
        </AuthGuard>
    );
}
