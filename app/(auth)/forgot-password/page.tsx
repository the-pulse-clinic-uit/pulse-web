"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";

type Step = "request-otp" | "reset-password";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("request-otp");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to send OTP");
                setLoading(false);
                return;
            }

            toast.success("OTP sent to your email!");
            setStep("reset-password");
        } catch (error) {
            console.error("Request OTP error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to reset password");
                setLoading(false);
                return;
            }

            toast.success("Password reset successfully!");
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex"
            style={{ backgroundImage: "url('/images/login-bg.png')" }}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
                <div className="card w-full max-w-md bg-white shadow-2xl rounded-3xl">
                    <div className="card-body p-8 lg:p-10">
                        {step === "request-otp" ? (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center lg:text-left">
                                    Forgot Password
                                </h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    Enter your email address and we&apos;ll send
                                    you an OTP to reset your password.
                                </p>

                                <form onSubmit={handleRequestOTP}>
                                    <div className="form-control mb-6">
                                        <label className="label pl-0">
                                            <span className="label-text text-gray-600 font-semibold">
                                                Email Address
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                placeholder="example@gmail.com"
                                                className="input input-bordered w-full pr-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl"
                                                required
                                            />
                                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn border-none bg-purple-600 hover:bg-purple-700 text-white normal-case text-lg font-semibold rounded-xl h-12 shadow-md hover:shadow-lg transition-all w-full disabled:bg-purple-400"
                                        >
                                            {loading
                                                ? "Sending..."
                                                : "Send OTP"}
                                        </button>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <Link
                                            href="/login"
                                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                                        >
                                            Back to Login
                                        </Link>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center lg:text-left">
                                    Reset Password
                                </h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    Enter the OTP sent to{" "}
                                    <span className="font-semibold">
                                        {email}
                                    </span>{" "}
                                    and your new password.
                                </p>

                                <form onSubmit={handleResetPassword}>
                                    <div className="form-control mb-5">
                                        <label className="label pl-0">
                                            <span className="label-text text-gray-600 font-semibold">
                                                OTP Code
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) =>
                                                    setOtp(e.target.value)
                                                }
                                                placeholder="Enter 6-digit code"
                                                maxLength={6}
                                                className="input input-bordered w-full pr-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl"
                                                required
                                            />
                                            <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="form-control mb-5">
                                        <label className="label pl-0">
                                            <span className="label-text text-gray-600 font-semibold">
                                                New Password
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={newPassword}
                                                onChange={(e) =>
                                                    setNewPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter new password"
                                                className="input input-bordered w-full pr-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 transition-colors"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
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

                                    <div className="form-control mb-6">
                                        <label className="label pl-0">
                                            <span className="label-text text-gray-600 font-semibold">
                                                Confirm Password
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Confirm new password"
                                                className="input input-bordered w-full pr-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 transition-colors"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                            >
                                                {showConfirmPassword ? (
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
                                            {loading
                                                ? "Resetting..."
                                                : "Reset Password"}
                                        </button>
                                    </div>

                                    <div className="mt-6 text-center space-y-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setStep("request-otp")
                                            }
                                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                                        >
                                            Didn&apos;t receive OTP? Resend
                                        </button>
                                        <div>
                                            <Link
                                                href="/login"
                                                className="text-gray-600 hover:text-gray-700 text-sm"
                                            >
                                                Back to Login
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="hidden lg:block flex-1"></div>
        </div>
    );
}
