"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";
import Cookies from "js-cookie";

const LoginForm = () => {
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

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            if (data.token) {
                Cookies.set("token", data.token, { expires: 7 });

                if (data.user) {
                    Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
                }

                router.push("/dashboard");
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
        <div
            className="min-h-screen bg-cover bg-center flex"
            style={{ backgroundImage: "url('/images/login-bg.png')" }}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 lg:items-start lg:pl-24">
                {" "}
                <div className="card w-full max-w-md bg-white shadow-2xl rounded-3xl relative">
                    <button
                        onClick={() => router.push("/")}
                        className="absolute top-4 right-4 btn btn-ghost btn-sm btn-circle text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                    <div className="card-body p-8 lg:p-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center lg:text-left">
                            Login to your account
                        </h2>

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
                                    placeholder="example@gmail.com"
                                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl"
                                    required
                                />
                            </div>
                            <div className="form-control mb-6">
                                <label className="label pl-0 flex justify-between items-center">
                                    <span className="label-text text-gray-600 font-semibold">
                                        Password
                                    </span>
                                    <Link
                                        href="/forgot-password"
                                        className="label-text-alt link link-hover text-purple-600 font-semibold"
                                    >
                                        Forgot ?
                                    </Link>
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
                                        className="input input-bordered w-full pr-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 transition-colors"
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
                                    className="btn border-none bg-purple-600 hover:bg-purple-700 text-white normal-case text-lg font-semibold rounded-xl h-12 shadow-md hover:shadow-lg transition-all w-full disabled:bg-purple-400"
                                >
                                    {loading ? "Logging in..." : "Login now"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block flex-1"></div>
        </div>
    );
};

export default LoginForm;
