"use client";

interface StarDistribution {
    stars: number;
    count: number;
    percentage: number;
}

const mockData: StarDistribution[] = [
    { stars: 5, count: 45, percentage: 75 },
    { stars: 4, count: 30, percentage: 50 },
    { stars: 3, count: 15, percentage: 25 },
    { stars: 2, count: 35, percentage: 58 },
    { stars: 1, count: 30, percentage: 50 },
];

export default function StarDistributionChart() {
    return (
        <div className="bg-purple-50 rounded-lg border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Star Rating Distribution
            </h3>
            <div className="space-y-3">
                {mockData.map((item) => (
                    <div key={item.stars} className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 w-4">
                            {item.stars}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-purple-600 h-full rounded-full"
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
