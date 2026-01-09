"use client";

interface ProfessionalInformation {
    specialty: string;
    licenseNumber: string;
}

interface DoctorProfessionalInformationCardProps {
    data: ProfessionalInformation;
    onEdit: () => void;
}

export default function DoctorProfessionalInformationCard({
    data,
    onEdit,
}: DoctorProfessionalInformationCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Professional Information
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Specialty</p>
                    <p className="text-base font-medium text-gray-900">
                        {data.specialty}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">License Number</p>
                    <p className="text-base font-medium text-gray-900">
                        {data.licenseNumber}
                    </p>
                </div>
            </div>
        </div>
    );
}
