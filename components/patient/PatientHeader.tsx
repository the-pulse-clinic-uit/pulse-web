"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import logo from "../../public/images/logo.png";

const PatientHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const navItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Appointments", href: "/appointments" },
        { name: "Records", href: "/records" },
        { name: "Invoices", href: "/invoices" },
        { name: "Profile", href: "/profile" },
    ];

    const isActiveLink = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
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
                        {navItems.map((item) => {
                            const active = isActiveLink(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`font-medium transition-colors ${
                                        active
                                            ? "text-primary font-bold"
                                            : "text-foreground hover:text-primary"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
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

                {/* MOBILE MENU */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-4">
                            {navItems.map((item) => {
                                const active = isActiveLink(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={toggleMenu}
                                        className={`font-medium transition-colors px-4 py-2 rounded-lg ${
                                            active
                                                ? "text-primary bg-primary/10 font-bold"
                                                : "text-foreground hover:text-primary hover:bg-gray-50"
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}

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
