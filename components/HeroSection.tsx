"use client";

import React, { CSSProperties, useMemo } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import heroImage from "../public/images/default-avatar.png";

const HeroSection = ({ id = "home" }: { id?: string }) => {
    const stats = useMemo(
        () => [
            { value: "1000+", label: "Healthcare Professionals" },
            { value: "50k+", label: "Happy Patients" },
            { value: "15+", label: "Years Experience" },
        ],
        []
    );

    const delay1s: CSSProperties = { animationDelay: "1s" };
    const delay03s: CSSProperties = { animationDelay: "0.3s" };

    return (
        <section id={id} className="min-h-screen pt-24 scroll-mt-28">
            <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center py-12">
                <div className="space-y-8">
                    <h1 className="text-5xl font-bold">
                        Health is the foundation of{" "}
                        <span className="text-primary">happiness</span>
                    </h1>

                    <div className="flex gap-4">
                        <Button variant="hero" size="xl">
                            Book Appointment
                        </Button>
                        <a href="#about">
                            <Button variant="outline" size="xl">
                                Learn More
                            </Button>
                        </a>
                    </div>

                    <div className="flex gap-8 pt-4">
                        {stats.map((s) => (
                            <div key={s.label}>
                                <div className="text-3xl font-bold">
                                    {s.value}
                                </div>
                                <div className="text-sm">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <Image
                    src={heroImage}
                    alt="Hero"
                    width={900}
                    height={700}
                    className="rounded-3xl shadow-xl"
                    priority
                />
            </div>
        </section>
    );
};

export default HeroSection;
