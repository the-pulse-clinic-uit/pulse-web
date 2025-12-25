"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import logo from "../public/images/logo.png";

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
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

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-foreground hover:text-primary font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#about"
                            className="text-foreground hover:text-primary font-medium transition-colors"
                        >
                            About us
                        </Link>
                        <Link
                            href="/#contact"
                            className="text-foreground hover:text-primary font-medium transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/site/register"
                            className="px-6 py-2.5 text-primary font-semibold hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Register
                        </Link>
                        <Link
                            href="/site/login"
                            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            Login
                        </Link>
                    </div>

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
                                href="/"
                                onClick={toggleMenu}
                                className="text-foreground hover:text-primary font-medium transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/#about"
                                onClick={toggleMenu}
                                className="text-foreground hover:text-primary font-medium transition-colors"
                            >
                                About us
                            </Link>
                            <Link
                                href="/#contact"
                                onClick={toggleMenu}
                                className="text-foreground hover:text-primary font-medium transition-colors"
                            >
                                Contact
                            </Link>
                            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                                <Link
                                    href="/site/register"
                                    onClick={toggleMenu}
                                    className="px-6 py-2.5 text-center text-primary font-semibold hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Register
                                </Link>
                                <Link
                                    href="/site/login"
                                    onClick={toggleMenu}
                                    className="px-6 py-2.5 text-center bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                                >
                                    Login
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;