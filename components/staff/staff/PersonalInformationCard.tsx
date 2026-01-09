"use client";

interface PersonalInformation {
    name: string;
    dateOfBirth: string;
    phoneNumber: string;
    emailAddress: string;
    address: string;
    gender: string;
    citizenId: string;
}

interface PersonalInformationCardProps {
    data: PersonalInformation;
    onEdit: () => void;
}

export default function PersonalInformationCard({
    data,
    onEdit,
}: PersonalInformationCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                </h3>
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <span>Edit</span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="text-base font-medium text-gray-900">
                        {data.name}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">Date Of Birth</p>
                    <p className="text-base font-medium text-gray-900">
                        {data.dateOfBirth}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="text-base font-medium text-gray-900">
                        {data.phoneNumber}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="text-base font-medium text-gray-900">
                        {data.emailAddress}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="text-base font-medium text-gray-900">
                        {data.address}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">Gender</p>
                    <p className="text-base font-medium text-gray-900">
                        {data.gender}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">Citizen ID</p>
                    <p className="text-base font-medium text-gray-900">
                        {data.citizenId}
                    </p>
                </div>
            </div>
        </div>
    );
}
