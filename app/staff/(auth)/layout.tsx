import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Staff Login - Pulse Clinic",
    description: "Hospital Staff Login Portal",
};

export default function StaffAuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
