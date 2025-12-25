"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div
            className="min-h-screen bg-cover bg-center flex"
            style={{ backgroundImage: "url('/images/login-bg.png')" }}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 lg:items-start lg:pl-24">
                {" "}
                <div className="card w-full max-w-md bg-white shadow-2xl rounded-3xl">
                    <div className="card-body p-8 lg:p-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center lg:text-left">
                            Login to your account
                        </h2>

                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-control mb-5">
                                <label className="label pl-0">
                                    <span className="label-text text-gray-600 font-semibold">
                                        Email
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="balamia@gmail.com"
                                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl"
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
                                        placeholder="Enter your password"
                                        className="input input-bordered w-full pr-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl"
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
                                <button className="btn border-none bg-purple-600 hover:bg-purple-700 text-white normal-case text-lg font-semibold rounded-xl h-12 shadow-md hover:shadow-lg transition-all w-full">
                                    Login now
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-8 text-gray-600 font-medium">
                            Don&apos;t Have An Account?{" "}
                            <Link
                                href="/register"
                                className="text-purple-600 font-bold hover:underline ml-1"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block flex-1"></div>
        </div>
    );
};

export default LoginForm;
