"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import Cookies from "js-cookie";

const AvatarSection = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [avatar, setAvatar] = useState<string>("/images/default-avatar.png");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const userStr = Cookies.get("user");
        if (userStr) {
            try {
                const patientData = JSON.parse(userStr);
                if (patientData.userDto?.avatarUrl) {
                    setAvatar(patientData.userDto.avatarUrl);
                }
            } catch (error) {}
        }
    }, []);

    const handleChangeAvatar = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setAvatar(previewUrl);
        setUploading(true);

        try {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("api/users/me/avatar", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to upload avatar");
            const updatedUser = await response.json();

            // Update the patient data in cookies with new avatar
            const userStr = Cookies.get("user");
            if (userStr) {
                const patientData = JSON.parse(userStr);
                if (patientData.userDto) {
                    patientData.userDto.avatarUrl = updatedUser.avatarUrl;
                    Cookies.set("user", JSON.stringify(patientData), {
                        expires: 7,
                    });
                }
            }
            setAvatar(updatedUser.avatarUrl);
            URL.revokeObjectURL(previewUrl);
        } catch (error) {
            alert("Failed to upload avatar. Please try again.");
            const userStr = Cookies.get("user");
            if (userStr) {
                const patientData = JSON.parse(userStr);
                setAvatar(
                    patientData.userDto?.avatarUrl ||
                        "/images/default-avatar.png"
                );
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center mb-10">
            <div className="relative group">
                <Image
                    src={avatar || "/images/default-avatar.png"}
                    alt="Avatar"
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-white shadow-md"
                />
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                    ) : (
                        <Camera className="w-6 h-6 text-white" />
                    )}
                </button>
            </div>

            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="mt-3 text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {uploading ? "Uploading..." : "Change avatar"}
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

export default AvatarSection;
