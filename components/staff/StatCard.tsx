import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend: string;
    trendUp?: boolean;
    description?: string;
}

const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendUp = true,
    description = "from last week",
}: StatCardProps) => {
    return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-base-content/70">
                            {title}
                        </h3>
                        <div className="mt-2 text-3xl font-bold text-base-content">
                            {value}
                        </div>
                    </div>

                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <Icon size={24} />
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs">
                    <span
                        className={`flex items-center gap-1 font-medium ${
                            trendUp ? "text-success" : "text-error"
                        }`}
                    >
                        {trendUp ? (
                            <TrendingUp size={14} />
                        ) : (
                            <TrendingDown size={14} />
                        )}
                        {trend}
                    </span>
                    <span className="text-base-content/50">{description}</span>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
