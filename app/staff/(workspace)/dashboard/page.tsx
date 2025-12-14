import DashboardHeader from "@/components/staff/DashboardHeader";

export default function DashboardPage() {
    return (
        <div className="flex flex-col min-h-screen px-6 py-8 bg-white">
            <DashboardHeader userName="Nguyen Huu Duy" />
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Hệ thống Pulse Clinic đang hoạt động!
                </h1>
                <p className="text-gray-500">
                    Đây là trang chủ hiện tại. Bắt đầu xây dựng UI ở đây.
                </p>
            </div>
        </div>
    );
}
