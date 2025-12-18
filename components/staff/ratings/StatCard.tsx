"use client";

interface StatCardProps {
    title: string;
    value: number | string;
    change: string;
    changeType?: "increase" | "decrease";
    showIcon?: boolean;
}

export default function StatCard({
    title,
    value,
    change,
    changeType = "increase",
    showIcon = true,
}: StatCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm text-gray-500">{title}</h3>
                {showIcon && (
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">i</span>
                    </div>
                )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
            <div
                className={`flex items-center gap-1 text-sm ${
                    changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                }`}
            >
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={
                        changeType === "decrease" ? "transform rotate-180" : ""
                    }
                >
                    <path
                        d="M6 3L9 6L6 9M6 3L3 6L6 9M6 3V9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <span>{change}</span>
            </div>
        </div>
    );
}
