"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Users } from "lucide-react";

const StaffRegisterForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        citizen_id: "",
        phone: "",
        birth_date: "",
        gender: "",
        password: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
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
            if (
                !formData.full_name ||
                !formData.email ||
                !formData.password ||
                !formData.citizen_id ||
                !formData.phone ||
                !formData.birth_date ||
                !formData.gender
            ) {
                setError("Please fill in all fields");
                setLoading(false);
                return;
            }

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    full_name: formData.full_name,
                    password: formData.password,
                    citizen_id: formData.citizen_id,
                    phone: formData.phone,
                    gender: formData.gender === "true",
                    birth_date: formData.birth_date,
                    role: "STAFF",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Registration failed");
                setLoading(false);
                return;
            }

            window.location.href =
                "http://staff.localhost:3000/login?registered=true";
        } catch (err) {
            setError("An error occurred. Please try again.");
            setLoading(false);
        }
    };

    const inputClassName =
        "input input-bordered w-full bg-gray-50 border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-xl";

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('/images/login-bg.png')" }}
        >
            <div className="w-full max-w-md p-6">
                <div className="card bg-white shadow-2xl rounded-3xl max-h-[90vh] flex flex-col">
                    <div className="card-body p-8 lg:p-10 flex flex-col overflow-hidden">
                        <div className="text-center mb-6 shrink-0">
                            <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-4">
                                <Users className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Staff Registration
                            </h2>
                            <p className="text-gray-600 mt-2 text-sm">
                                Create your staff account
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
                        >
                            {error && (
                                <div className="alert alert-error mb-4 py-2 rounded-xl">
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <div className="form-control mb-4">
                                <label className="label pl-0">
                                    <span className="label-text text-gray-600 font-semibold">
                                        Full Name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Nguyen Van A"
                                    className={inputClassName}
                                    required
                                />
                            </div>

                            <div className="form-control mb-4">
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
                                    className={inputClassName}
                                    required
                                />
                            </div>

                            <div className="form-control mb-4">
                                <label className="label pl-0">
                                    <span className="label-text text-gray-600 font-semibold">
                                        Citizen ID
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="citizen_id"
                                    value={formData.citizen_id}
                                    onChange={handleChange}
                                    placeholder="001234567890"
                                    className={inputClassName}
                                    required
                                />
                            </div>

                            <div className="form-control mb-4">
                                <label className="label pl-0">
                                    <span className="label-text text-gray-600 font-semibold">
                                        Phone Number
                                    </span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="0901234567"
                                    className={inputClassName}
                                    required
                                />
                            </div>

                            <div className="form-control mb-4">
                                <label className="label pl-0">
                                    <span className="label-text text-gray-600 font-semibold">
                                        Birth Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    required
                                />
                            </div>

                            <div className="form-control mb-4">
                                <label className="label pl-0">
                                    <span className="label-text text-gray-600 font-semibold">
                                        Gender
                                    </span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={`select select-bordered w-full bg-gray-50 border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-xl`}
                                    required
                                >
                                    <option value="">Select gender</option>
                                    <option value="true">Male</option>
                                    <option value="false">Female</option>
                                </select>
                            </div>

                            <div className="form-control mb-4">
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
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Your password"
                                        className={`${inputClassName} pr-12`}
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

                            <div className="form-control mb-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary text-white normal-case text-lg font-semibold rounded-xl h-12 shadow-md hover:shadow-lg transition-all w-full"
                                >
                                    {loading
                                        ? "Creating account..."
                                        : "Create account"}
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-4 text-gray-600 font-medium shrink-0 pt-2 border-t border-gray-100">
                            Already have an account?{" "}
                            <Link
                                href="http://staff.localhost:3000/login"
                                className="text-primary font-bold hover:underline ml-1"
                            >
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffRegisterForm;
