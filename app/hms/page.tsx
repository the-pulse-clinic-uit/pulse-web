import Link from 'next/link';

export default function HMSHomePage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="max-w-5xl w-full mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Hospital Management System
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Welcome to Pulse Clinic HMS. Please select your role to continue.
                    </p>
                </div>

                {/* Role Selection Cards */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Staff Card */}
                    <Link href="/staff/dashboard">
                        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="relative p-8">
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                                    <svg className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    Staff
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Manage patients, appointments, admissions, medications, and administrative operations.
                                </p>
                                
                                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                    Continue as Staff
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="border-t border-gray-100 bg-gray-50 px-8 py-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">Patient Management</span>
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">Appointments</span>
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">Invoices</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Doctor Card */}
                    <Link href="/doctor/dashboard">
                        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="relative p-8">
                                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6 group-hover:bg-green-600 transition-colors duration-300">
                                    <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    Doctor
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Manage consultations, prescriptions, follow-up plans, and doctor schedules.
                                </p>
                                
                                <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                    Continue as Doctor
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="border-t border-gray-100 bg-gray-50 px-8 py-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">Consultations</span>
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">Prescriptions</span>
                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">Schedule</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        Need help? Contact IT department or system administrator.
                    </p>
                </div>
            </div>
        </div>
    );
}
