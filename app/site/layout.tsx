import React from "react";

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
            <aside className="w-64 flex-shrink-0 border-r bg-white hidden md:block">
                <div className="h-full flex flex-col">
                    <div className="p-6 text-xl font-bold text-blue-600">
                        Pulse Doctor
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10">
                    <h1 className="text-lg font-medium text-slate-800">
                        Không gian làm việc
                    </h1>
                </header>

                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="max-w-6xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
