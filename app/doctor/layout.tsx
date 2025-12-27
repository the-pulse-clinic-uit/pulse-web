import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Doctor Portal",
    description: "Doctor Dashboard",
};

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
