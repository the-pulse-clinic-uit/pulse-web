"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface StaffAuthGuardProps {
    children: React.ReactNode;
}

const StaffAuthGuard = ({ children }: StaffAuthGuardProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");

            if (!token) {
                window.location.href = "http://staff.localhost:3000/login";
                return;
            }

            // Verify role if user data exists
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user.role !== "STAFF") {
                        // Wrong role, redirect to HMS
                        window.location.href = "http://hms.localhost:3000";
                        return;
                    }
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    window.location.href = "http://staff.localhost:3000/login";
                    return;
                }
            }

            // Token exists and role is correct
            setIsAuthenticated(true);
            setIsLoading(false);
        };

        checkAuth();
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default StaffAuthGuard;
