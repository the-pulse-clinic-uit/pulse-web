"use client";

interface TemplateCardProps {
    title: string;
    description: string;
    isSelected?: boolean;
    onClick: () => void;
}

export default function TemplateCard({
    title,
    description,
    isSelected = false,
    onClick,
}: TemplateCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
                p-4 rounded-lg cursor-pointer transition-all
                ${
                    isSelected
                        ? "bg-purple-100 border-2 border-blue-500"
                        : "bg-purple-50 border border-purple-100 hover:bg-purple-100"
                }
            `}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-purple-600"
                    >
                        <path
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle
                            cx="17"
                            cy="17"
                            r="3"
                            fill="white"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <path
                            d="M17 16v2m0 0h-1m1 0h1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                        {title}
                    </h4>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );
}
