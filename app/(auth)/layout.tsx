import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication - The Pulse Clinic",
    description: "Login or Register",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
