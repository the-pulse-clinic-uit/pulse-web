"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import { Menu, X } from "lucide-react";
import Button from "@/ui_components/button";

const Header: React.FC<{ brandName?: string }> = ({
  brandName = "The Pulse Clinic",
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => setMobileOpen((s) => !s), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const nav = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Left: logo */}
          <Link href="/" className="flex items-center gap-4">
            <Image
              src={logo}
              alt={brandName}
              width={70}
              height={70}
              priority
              className="rounded-md bg-white p-1"
            />
            <span className="hidden sm:inline-block font-semibold text-lg">
              {brandName}
            </span>
          </Link>

          {/* Center: nav (desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative font-medium text-foreground transition-colors hover:text-primary
                           after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0
                           after:bg-primary after:transition-all hover:after:w-full"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              {/* Register */}
              <Button
                variant="outline"
                className="
                  transition-all
                  hover:bg-primary/10
                  active:scale-95
                  focus-visible:ring-2 focus-visible:ring-primary
                "
              >
                Register
              </Button>

              {/* Login */}
              <Button
                variant="default"
                className="
                  transition-all
                  shadow-md
                  hover:shadow-lg
                  hover:brightness-105
                  active:scale-95
                  focus-visible:ring-2 focus-visible:ring-primary
                "
              >
                Login
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              aria-label="Toggle menu"
              onClick={toggleMobile}
              className="
                md:hidden p-2 rounded-md
                hover:bg-accent/20
                active:scale-95
                transition-transform
              "
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 pb-4">
            <div className="flex flex-col gap-2">
              {nav.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={closeMobile}
                  className="
                    px-3 py-2 rounded-md font-medium
                    text-foreground hover:bg-accent/10
                    active:scale-[0.98]
                    transition-all
                  "
                >
                  {item.name}
                </a>
              ))}

              <div className="flex gap-2 px-2 pt-3">
                <Button
                  className="flex-1 active:scale-95 transition-transform"
                  variant="outline"
                >
                  Register
                </Button>
                <Button
                  className="flex-1 active:scale-95 transition-transform"
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
