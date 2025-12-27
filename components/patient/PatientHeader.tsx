"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Menu, X } from "lucide-react";
import logo from "../../public/images/logo.png";

const PatientHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src={logo}
                            alt="The Pulse Clinic"
                            width={48}
                            height={48}
                            className="w-12 h-12"
                        />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-primary uppercase tracking-tight">
                                The Pulse
                            </span>
                            <span className="text-xs text-primary uppercase tracking-wider">
                                Clinic
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/dashboard"
                            className="text-foreground hover:text-primary font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/appointments"
                            className="text-foreground hover:text-primary font-medium transition-colors"
                        >
                            Appointments
                        </Link>
                        <Link
                            href="/records"
                            className="text-foreground hover:text-primary font-medium transition-colors"
                        >
                            Records
                        </Link>
                        <Link
                            href="/invoices"
                            className="text-foreground hover:text-primary font-medium transition-colors"
                        >
                            Invoices
                        </Link>
                        <Link
                            href="/profile"
                            className="text-foreground hover:text-primary font-medium transition-colors"
                        >
                            Profile
                        </Link>
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-colors shadow-sm"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                href="/dashboard"
                                onClick={toggleMenu}
                                className="text-foreground hover:text-primary font-medium transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/appointments"
                                onClick={toggleMenu}
                                className="text-foreground hover:text-primary font-medium transition-colors"
                            >
                                Appointments
                            </Link>
                            <Link
                                href="/records"
                                onClick={toggleMenu}
                                className="text-foreground hover:text-primary font-medium transition-colors"
                            >
                                Records
                            </Link>
                            <Link
                                href="/invoices"
                                onClick={toggleMenu}
                                className="text-foreground hover:text-primary font-medium transition-colors"
                            >
                                Invoices
                            </Link>
                            <Link
                                href="/profile"
                                onClick={toggleMenu}
                                className="text-foreground hover:text-primary font-medium transition-colors"
                            >
                                Profile
                            </Link>
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        toggleMenu();
                                        handleLogout();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default PatientHeader;
