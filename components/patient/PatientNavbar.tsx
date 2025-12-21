"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { Menu, X, LogOut } from "lucide-react";

const PatientNavbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleLogout = () => {
    alert("You have been logged out!");
  };

  const nav = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Appointments", href: "/appointments" },
    { name: "Invoices", href: "/invoices" },
    { name: "Medical Records", href: "/records" },
    { name: "Chat", href: "/chat" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 lg:h-24 items-center">
          <div className="flex-shrink-0 mr-8">
            <Link href="/dashboard" className="flex items-center gap-4">
              <Image
                src={logo}
                alt="The Pulse Clinic"
                width={64}
                height={64}
                priority
                className="rounded-md bg-white p-1"
              />
              <span className="hidden sm:inline-block text-lg font-semibold">
                The Pulse Clinic
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {nav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="
                  relative font-medium text-foreground
                  transition-colors hover:text-primary
                  after:absolute after:-bottom-1 after:left-0
                  after:h-[2px] after:w-0 after:bg-primary
                  after:transition-all hover:after:w-full
                "
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center ml-8">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={toggleMobile}
            className="md:hidden rounded-md p-2 transition-all hover:bg-accent/20 active:scale-95 ml-auto"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-2 pt-2">
              {nav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobile}
                  className="rounded-md px-3 py-2 font-medium text-foreground transition-all hover:bg-accent/10 active:scale-[0.98]"
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 font-medium text-red-600 rounded-md hover:bg-red-100 transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default PatientNavbar;
