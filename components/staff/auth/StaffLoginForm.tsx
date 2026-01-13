"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Users } from "lucide-react";
import Cookies from "js-cookie";
import {
    buildSubdomainUrl,
    navigateToSubdomain,
    getCookieDomain,
} from "@/utils/subdomainUtils";
import { apiRequest } from "@/lib/api";

const StaffLoginForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!formData.email || !formData.password) {
                setError("Please fill in all fields");
                setLoading(false);
                return;
            }

            const response = await apiRequest("auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            if (data.token) {
                const cookieDomain = getCookieDomain();
                const cookieOptions: Cookies.CookieAttributes = {
                    expires: 7,
                    secure: window.location.protocol === "https:",
                    sameSite: "lax",
                };

                if (cookieDomain) {
                    cookieOptions.domain = cookieDomain;
                }

                Cookies.set("token", data.token, cookieOptions);

                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                navigateToSubdomain("staff", "/dashboard");
            } else {
                setError("No token received");
                setLoading(false);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center">
            <div className="w-full max-w-md p-6">
                <div className="card bg-white shadow-2xl rounded-3xl">
                    <div className="card-body p-8 lg:p-10">
                        <div className="text-center mb-6">
                            <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-4">
                                <Users className="w-12 h-12 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Staff Login
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Sign in to access staff dashboard
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="alert alert-error mb-4 py-2 rounded-xl">
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <div className="form-control mb-5">
                                <label className="label pl-0">
                                    <span className="label-text text-gray-600 font-semibold">
                                        Email
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="staff@hospital.com"
                                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                                    required
                                />
                            </div>

                            <div className="form-control mb-6">
                                <label className="label pl-0 flex justify-between items-center">
                                    <span className="label-text text-gray-600 font-semibold">
                                        Password
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        className="input input-bordered w-full pr-12 bg-gray-50 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={22} />
                                        ) : (
                                            <Eye size={22} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="form-control">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary text-white normal-case text-lg font-semibold rounded-xl h-12 shadow-md hover:shadow-lg transition-all w-full"
                                >
                                    {loading ? "Logging in..." : "Login now"}
                                </button>
                            </div>
                        </form>

                        <div className="divider my-6">OR</div>

                        <button
                            type="button"
                            onClick={() => navigateToSubdomain("hms")}
                            className="btn btn-outline btn-primary normal-case text-base font-semibold rounded-xl h-12 w-full"
                        >
                            Back to Role Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffLoginForm;
