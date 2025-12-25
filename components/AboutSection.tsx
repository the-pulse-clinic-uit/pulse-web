"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import teamImage from "../public/images/default-avatar.png";

type AboutSectionProps = {
    id?: string;
    imageSrc?: StaticImageData;
};

const AboutSection: React.FC<AboutSectionProps> = ({
    id = "about",
    imageSrc = teamImage,
}) => {
    return (
        <section id={id} className="py-20 lg:py-32 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative animate-fade-in-left">
                        <div className="relative">
                            <Image
                                src={imageSrc}
                                alt="The Pulse Clinic medical team - diverse group of healthcare professionals"
                                className="w-full rounded-3xl shadow-2xl"
                                priority
                            />
                            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl">
                                <div className="text-4xl font-bold">15+</div>
                                <div className="text-sm opacity-90">
                                    Years of Excellence
                                </div>
                            </div>
                        </div>

                        <div
                            className="absolute -z-10 -top-6 -left-6 w-full h-full bg-lavender-200 rounded-3xl"
                            aria-hidden="true"
                        />
                    </div>

                    <div className="space-y-6 animate-fade-in-right">
                        <div className="space-y-2">
                            <span className="text-primary font-semibold text-lg">
                                About Us
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                                The Pulse Clinic
                            </h2>
                        </div>

                        <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                            <p>
                                Founded with a vision to transform healthcare
                                delivery, The Pulse Clinic has been serving our
                                community with excellence for over 15 years...
                            </p>
                            <p>
                                Our team of over 1,000 dedicated healthcare
                                professionals brings together diverse expertise
                                spanning across multiple specialties...
                            </p>
                            <p>
                                At The Pulse Clinic, we believe that exceptional
                                healthcare goes beyond treating symptoms -
                                it&apos;s about understanding each
                                patient&apos;s unique needs...
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span
                                        className="text-2xl"
                                        aria-hidden="true"
                                    >
                                        🏆
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground">
                                        Accredited
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Healthcare Facility
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-mint/20 rounded-full flex items-center justify-center">
                                    <span
                                        className="text-2xl"
                                        aria-hidden="true"
                                    >
                                        ⭐
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground">
                                        4.9 Rating
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Patient Satisfaction
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
