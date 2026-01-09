import PatientHeader from "@/components/patient/PatientHeader";
import AuthGuard from "@/components/auth/AuthGuard";
import ToastProvider from "@/components/common/ToastProvider";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <ToastProvider />
            <PatientHeader />
            <main>{children}</main>
        </AuthGuard>
    );
}
