import DashboardHeader from "@/components/staff/DashboardHeader";
import StatsGrid from "@/components/staff/StatGrid";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <DashboardHeader userName="Nguyen Huu Duy" />
            <StatsGrid />
        </div>
    );
}
