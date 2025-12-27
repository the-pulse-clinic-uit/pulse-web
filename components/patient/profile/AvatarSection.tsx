"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

const AvatarSection = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [avatar, setAvatar] = useState("");

    const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setAvatar(url);
    };

    return (
        <div className="flex flex-col items-center mb-10">
            <div className="relative group">
                <Image
                    src={avatar}
                    alt="Avatar"
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-white shadow-md"
                />
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                    <Camera className="w-6 h-6 text-white" />
                </button>
            </div>

            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-3 text-sm text-purple-600 hover:underline"
            >
                Change avatar
            </button>

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleChangeAvatar}
            />
        </div>
    );
};

export default AvatarSection;
