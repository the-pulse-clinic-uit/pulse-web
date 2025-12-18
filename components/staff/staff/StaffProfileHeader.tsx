"use client";

import Image from "next/image";

interface StaffProfileHeaderProps {
    name: string;
    role: string;
    avatarUrl: string;
}

export default function StaffProfileHeader({
    name,
    role,
    avatarUrl,
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
            </div>
        </div>
    );
}
