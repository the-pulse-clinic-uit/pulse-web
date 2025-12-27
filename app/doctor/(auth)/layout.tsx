import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Doctor Login - Pulse Clinic",
    description: "Hospital Doctor Login Portal",
};

export default function DoctorAuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
