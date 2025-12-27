import type { Metadata } from "next";
import "../../globals.css";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorAuthGuard from "@/components/doctor/auth/DoctorAuthGuard";

export const metadata: Metadata = {
    title: "Doctor Clinic Management",
    description: "Medical Dashboard",
};

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DoctorAuthGuard>
            <div className="flex min-h-screen bg-base-200">
                <DoctorSidebar />
                <main className="flex-1 overflow-y-auto h-screen">
                    {children}
                </main>
            </div>
        </DoctorAuthGuard>
    );
}
