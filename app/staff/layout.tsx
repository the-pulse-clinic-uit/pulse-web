import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "@/components/staff/Sidebar";

export const metadata: Metadata = {
    title: "Clinic Management",
    description: "Medical Dashboard",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-base-200">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
