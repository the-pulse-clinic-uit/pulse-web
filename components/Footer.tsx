"use client";

import React, { useMemo } from "react";
import {
    Heart,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import logo from "../public/images/logo.png";

type LinkItem = { name: string; href: string };
type SocialLink = { icon: LucideIcon; href: string; label: string };

type FooterProps = {
    brandName?: string;
    yearFounded?: number;
    contact?: {
        addressLines?: string[];
        phone?: string;
        phoneHref?: string;
        email?: string;
    };
};

const Footer: React.FC<FooterProps> = ({
    brandName = "The Pulse",
    yearFounded = 2025,
    contact = {
        addressLines: ["Thu Duc City, Ho Chi Minh City", "Vietnam"],
        phone: "+1 (800) 123-4567",
        phoneHref: "tel:+18001234567",
        email: "info@thepulse.clinic",
    },
}) => {
    const year = useMemo(() => new Date().getFullYear(), []);

    const quickLinks: LinkItem[] = [
        { name: "Home", href: "#home" },
        { name: "About Us", href: "#about" },
        { name: "Contact", href: "#contact" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
    ];

    const services: string[] = [
        "General Medicine",
        "Cardiology",
        "Pediatrics",
        "Emergency Care",
        "Laboratory Services",
        "Health Checkups",
    ];

    const socialLinks: SocialLink[] = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
    ];

    return (
        <footer
            id="contact"
            className="bg-foreground text-background scroll-mt-24"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <a
                            href="/dashboard"
                            className="flex items-center gap-2"
                        >
                            <Image
                                src={logo}
                                alt={`${brandName} Logo`}
                                width={40}
                                height={40}
                                className="rounded-xl object-cover"
                            />
                            <span className="text-xl font-bold">
                                {brandName}
                            </span>
                        </a>

                        <p className="text-background/70 leading-relaxed">
                            Providing exceptional healthcare services with
                            compassion, dignity, and unwavering commitment to
                            your well-being since {yearFounded}.
                        </p>

                        <div className="flex gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-background/70 hover:text-primary transition-colors duration-200"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6">Our Services</h3>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service}>
                                    <span className="text-background/70">
                                        {service}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span className="text-background/70">
                                    {(contact.addressLines ?? []).map(
                                        (line, idx) => (
                                            <React.Fragment key={idx}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        )
                                    )}
                                </span>
                            </li>

                            {contact.phone && (
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                    <a
                                        href={contact.phoneHref ?? "#"}
                                        className="text-background/70 hover:text-primary transition-colors"
                                    >
                                        {contact.phone}
                                    </a>
                                </li>
                            )}

                            {contact.email && (
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="text-background/70 hover:text-primary transition-colors"
                                    >
                                        {contact.email}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-background/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-background/60 text-sm">
                            © {year} {brandName} Clinic. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
