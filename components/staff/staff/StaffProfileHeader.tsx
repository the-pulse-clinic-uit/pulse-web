"use client";

import Image from "next/image";

interface StaffProfileHeaderProps {
    name: string;
    role: string;
    avatarUrl: string;
    onEdit: () => void;
}

export default function StaffProfileHeader({
    name,
    role,
    avatarUrl,
    onEdit,
}: StaffProfileHeaderProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                        <Image
                            src={avatarUrl}
                            alt={name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {name}
                        </h2>
                        <p className="text-sm text-gray-500">{role}</p>
                    </div>
                </div>
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
        </div>
    );
}
