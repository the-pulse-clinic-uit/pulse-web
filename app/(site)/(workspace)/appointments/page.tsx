import AppointmentList from "@/components/patient/appointments/AppointmentList";

export default function AppointmentsPage() {
    return (
        <div className="min-h-screen mt-16 sm:mt-20 lg:mt-24">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
                <AppointmentList />
            </div>
        </div>
    );
}
