"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div
            className="min-h-screen bg-cover bg-center flex"
            style={{ backgroundImage: "url('/images/login-bg.png')" }}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 lg:items-start lg:pl-24">
                <div className="card w-full max-w-md bg-white shadow-2xl rounded-3xl">
                    <div className="card-body p-8 lg:p-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center lg:text-left">
                            Create an account
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
                                <label className="label pl-0">
                                    <span className="label-text text-gray-600 font-semibold">
                                        Password
                                    </span>
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

                            <div className="form-control mb-4">
                                <button className="btn border-none bg-purple-600 hover:bg-purple-700 text-white normal-case text-lg font-semibold rounded-xl h-12 shadow-md hover:shadow-lg transition-all w-full">
                                    Create account
                                </button>
                            </div>

                            <div className="form-control">
                                <button
                                    type="button"
                                    className="btn btn-outline border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-700 hover:text-purple-600 normal-case text-base font-semibold rounded-xl h-12 w-full"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                    >
                                        <path
                                            d="M19.8055 10.2292C19.8055 9.55155 19.7499 8.86906 19.6306 8.20312H10.2002V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8251C18.7177 15.8449 19.8055 13.2728 19.8055 10.2292Z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M10.2002 20.0006C12.9516 20.0006 15.2726 19.1151 16.8294 17.5865L13.6068 15.0879C12.7071 15.6979 11.5536 16.0433 10.2044 16.0433C7.54396 16.0433 5.28657 14.2831 4.50431 11.9097H1.17578V14.4815C2.77524 17.6517 6.31461 20.0006 10.2002 20.0006Z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M4.5001 11.9097C4.07336 10.6678 4.07336 9.33652 4.5001 8.09461V5.52285H1.17578C-0.196389 8.24045 -0.196389 11.7638 1.17578 14.4814L4.5001 11.9097Z"
                                            fill="#FBBC04"
                                        />
                                        <path
                                            d="M10.2002 3.95805C11.6285 3.936 13.0071 4.47247 14.0417 5.45722L16.8933 2.60562C15.1818 0.990517 12.9344 0.0969506 10.2002 0.122177C6.31461 0.122177 2.77524 2.47105 1.17578 5.64116L4.50011 8.21292C5.27816 5.83525 7.53976 3.95805 10.2002 3.95805Z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span className="ml-2">
                                        Continue with Google
                                    </span>
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-8 text-gray-600 font-medium">
                            Already have an account ?{" "}
                            <Link
                                href="/site/login"
                                className="text-purple-600 font-bold hover:underline ml-1"
                            >
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block flex-1"></div>
        </div>
    );
};

export default RegisterForm;
