import DashboardHeader from "@/components/staff/dashboard/DashboardHeader";
import NotificationPanel from "@/components/staff/dashboard/NotificationPanel";
import PatientStatisticChart from "@/components/staff/dashboard/PatientStatisticChart";
import StatsGrid from "@/components/staff/dashboard/StatGrid";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <DashboardHeader userName="Nguyen Huu Duy" />
            <StatsGrid />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[450px]">
                <div className="lg:col-span-2">
                    <PatientStatisticChart />
                </div>
                <div className="lg:col-span-1">
                    <NotificationPanel />
                </div>
            </div>
        </div>
    );
}
