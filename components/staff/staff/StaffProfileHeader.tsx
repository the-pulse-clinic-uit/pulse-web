"use client";

import AvatarUploadSection from "./AvatarUploadSection";

interface StaffProfileHeaderProps {
    name: string;
    role: string;
    avatarUrl: string;
    onAvatarUpdate: (newAvatarUrl: string) => void;
}

export default function StaffProfileHeader({
    name,
    role,
    avatarUrl,
    onAvatarUpdate,
}: StaffProfileHeaderProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <AvatarUploadSection
                        currentAvatar={avatarUrl}
                        onAvatarUpdate={onAvatarUpdate}
                    />
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
