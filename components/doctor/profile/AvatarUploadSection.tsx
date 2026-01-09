"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { toast } from "react-hot-toast";

interface AvatarUploadSectionProps {
    currentAvatar: string;
    onAvatarUpdate: (newAvatarUrl: string) => void;
}

const AvatarUploadSection = ({
    currentAvatar,
    onAvatarUpdate,
}: AvatarUploadSectionProps) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [avatar, setAvatar] = useState<string>(currentAvatar);
    const [uploading, setUploading] = useState(false);

    const handleChangeAvatar = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setAvatar(previewUrl);
        setUploading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/users/me/avatar", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to upload avatar");
            const updatedUser = await response.json();

            // Update the doctor data in localStorage with new avatar
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const doctorData = JSON.parse(userStr);
                if (doctorData.staffDto?.userDto) {
                    doctorData.staffDto.userDto.avatarUrl = updatedUser.avatarUrl;
                    localStorage.setItem("user", JSON.stringify(doctorData));
                }
            }

            setAvatar(updatedUser.avatarUrl);
            onAvatarUpdate(updatedUser.avatarUrl);
            URL.revokeObjectURL(previewUrl);
            toast.success("Avatar updated successfully!");
        } catch (error) {
            toast.error("Failed to upload avatar. Please try again.");
            // Revert to previous avatar
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const doctorData = JSON.parse(userStr);
                setAvatar(
                    doctorData.staffDto?.userDto?.avatarUrl ||
                        "/images/avatar-placeholder.jpg"
                );
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative group">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
                <Image
                    src={avatar || "/images/avatar-placeholder.jpg"}
                    alt="Doctor Avatar"
                    fill
                    className="object-cover"
                />
            </div>
            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition disabled:cursor-not-allowed"
                title="Change avatar"
            >
                {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                ) : (
                    <Camera className="w-6 h-6 text-white" />
                )}
            </button>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleChangeAvatar}
                disabled={uploading}
            />
        </div>
    );
};

export default AvatarUploadSection;
