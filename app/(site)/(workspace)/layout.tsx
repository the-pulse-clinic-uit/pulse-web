import PatientHeader from "@/components/patient/PatientHeader";
import AuthGuard from "@/components/auth/AuthGuard";
import ToastProvider from "@/components/common/ToastProvider";
import FloatingChatButton from "@/components/patient/FloatingChatButton";

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
            <FloatingChatButton />
        </AuthGuard>
    );
}
