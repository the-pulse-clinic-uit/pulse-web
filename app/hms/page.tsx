import Link from "next/link";
import Image from "next/image";
import logo from "../../public/images/logo.png";
import { Users, Stethoscope, ArrowRight } from "lucide-react";

export default function HMSHomePage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="max-w-5xl w-full mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <Image
                            src={logo}
                            alt="The Pulse Clinic"
                            width={96}
                            height={96}
                            className="w-30 h-30"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Hospital Management System
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Welcome to Pulse Clinic HMS. Please select your role to
                        continue.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <Link href="http://staff.localhost:3000/login">
                        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative p-8">
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                                    <Users className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    Staff
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Manage patients, appointments, admissions,
                                    medications, and administrative operations.
                                </p>

                                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                    Continue as Staff
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 bg-gray-50 px-8 py-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">
                                        Patient Management
                                    </span>
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">
                                        Appointments
                                    </span>
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">
                                        Invoices
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="http://doctor.localhost:3000/login">
                        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative p-8">
                                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6 group-hover:bg-green-600 transition-colors duration-300">
                                    <Stethoscope className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    Doctor
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Manage consultations, prescriptions,
                                    follow-up plans, and doctor schedules.
                                </p>

                                <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                    Continue as Doctor
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 bg-gray-50 px-8 py-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">
                                        Consultations
                                    </span>
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">
                                        Prescriptions
                                    </span>
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">
                                        Schedule
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
