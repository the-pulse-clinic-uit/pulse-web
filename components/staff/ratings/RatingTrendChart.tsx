"use client";

export default function RatingTrendChart() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Rating Trend
            </h3>
            <div className="relative h-64">
                {/* Simple placeholder - you can integrate a charting library like recharts or chart.js */}
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 600 250"
                    preserveAspectRatio="none"
                >
                    {/* Grid lines */}
                    <line
                        x1="0"
                        y1="200"
                        x2="600"
                        y2="200"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                    />

                    {/* Trend line */}
                    <path
                        d="M 50,150 Q 100,180 150,160 T 250,140 T 350,120 T 450,80 L 550,60"
                        stroke="#9333ea"
                        strokeWidth="3"
                        fill="none"
                    />

                    {/* Data point at the end */}
                    <circle cx="550" cy="60" r="6" fill="#9333ea" />

                    {/* Label background */}
                    <rect
                        x="500"
                        y="30"
                        width="80"
                        height="30"
                        fill="#1f2937"
                        rx="4"
                    />
                    <text
                        x="540"
                        y="50"
                        fill="white"
                        fontSize="14"
                        textAnchor="middle"
                    >
                        Aug 8
                    </text>

                    {/* X-axis labels */}
                    {[
                        { x: 50, label: "02" },
                        { x: 120, label: "03" },
                        { x: 190, label: "04" },
                        { x: 260, label: "05" },
                        { x: 330, label: "06" },
                        { x: 400, label: "07" },
                        { x: 470, label: "08" },
                        { x: 540, label: "09" },
                    ].map((item) => (
                        <text
                            key={item.x}
                            x={item.x}
                            y="230"
                            fill="#6b7280"
                            fontSize="12"
                            textAnchor="middle"
                        >
                            {item.label}
                        </text>
                    ))}
                </svg>
            </div>
        </div>
    );
}
