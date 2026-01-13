import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
}

const StatCard = ({ title, value, icon: Icon }: StatCardProps) => {
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
            </div>
        </div>
    );
};

export default StatCard;
