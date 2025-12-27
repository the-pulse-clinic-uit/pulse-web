import React from "react";

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {children}
        </main>
    );
}
