"use client";

import React, { CSSProperties } from "react";
import { Heart, Shield, Lightbulb, Users, type LucideIcon } from "lucide-react";

type CoreValueItem = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const coreValues: CoreValueItem[] = [
    {
        icon: Heart,
        title: "Dedication",
        description:
            "We are committed to providing exceptional care with unwavering focus on patient well-being. Every decision we make puts your health first.",
    },
    {
        icon: Shield,
        title: "Responsibility",
        description:
            "We hold ourselves accountable for delivering the highest standards of medical care. Your trust is our most valued asset.",
    },
    {
        icon: Lightbulb,
        title: "Innovation",
        description:
            "We embrace cutting-edge medical technologies and treatments to ensure you receive the most advanced care available.",
    },
    {
        icon: Users,
        title: "Patient-Centered Care",
        description:
            "Every patient is unique. We tailor our approach to meet your individual needs, preferences, and healthcare goals.",
    },
];

type CoreValuesSectionProps = {
    id?: string;
};

const CoreValuesSection: React.FC<CoreValuesSectionProps> = ({
    id = "values",
}) => {
    return (
        <section id={id} className="py-20 lg:py-32 bg-background scroll-mt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-primary font-semibold text-lg">
                        What We Stand For
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                        Our Core Values
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        These principles guide everything we do at The Pulse
                        Clinic, ensuring we deliver healthcare that truly makes
                        a difference.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {coreValues.map((value, index) => {
                        const delayStyle: CSSProperties = {
                            animationDelay: `${index * 0.1}s`,
                        };

                        const Icon = value.icon;

                        return (
                            <div
                                key={value.title}
                                className="group bg-card p-8 rounded-2xl shadow-lg border border-border/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                                style={delayStyle}
                            >
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                    <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CoreValuesSection;
