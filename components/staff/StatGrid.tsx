import {
    CalendarClock,
    ClipboardList,
    Users,
    MessageSquareText,
} from "lucide-react";
import StatCard from "./StatCard";

const StatsGrid = () => {
    const statsData = [
        {
            title: "Today's Appointments",
            value: 12,
            icon: CalendarClock,
            trend: "12%",
            trendUp: true,
        },
        {
            title: "Admission",
            value: 8,
            icon: ClipboardList,
            trend: "5%",
            trendUp: false,
        },
        {
            title: "Waitlist",
            value: 3,
            icon: Users,
            trend: "20%",
            trendUp: true,
        },
        {
            title: "Message",
            value: 24,
            icon: MessageSquareText,
            trend: "12%",
            trendUp: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    trend={stat.trend}
                    trendUp={stat.trendUp}
                />
            ))}
        </div>
    );
};

export default StatsGrid;
