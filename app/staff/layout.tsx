import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Staff Portal",
    description: "Staff Dashboard",
};

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
