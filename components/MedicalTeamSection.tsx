"use client";

import React, { CSSProperties } from "react";
import Image, { StaticImageData } from "next/image";

import doctor1 from "../public/images/doctor1.jpg";
import doctor2 from "../public/images/doctor2.jpg";
import doctor3 from "../public/images/doctor3.jpg";
import doctor4 from "../public/images/doctor4.jpg";

type Doctor = {
    name: string;
    specialty: string;
    image: StaticImageData;
};

const doctors: Doctor[] = [
    {
        name: "Dr. Clara Bellweathe",
        specialty: "Chief Medical Officer",
        image: doctor1,
    },
    {
        name: "Dr. Olivia Sterling",
        specialty: "Cardiology Specialist",
        image: doctor2,
    },
    {
        name: "Dr. Robert Anderson",
        specialty: "Senior Physician",
        image: doctor3,
    },
    {
        name: "Dr. James Sullivan",
        specialty: "Internal Medicine",
        image: doctor4,
    },
];

type MedicalTeamSectionProps = {
    id?: string;
};

const MedicalTeamSection: React.FC<MedicalTeamSectionProps> = ({
    id = "team",
}) => {
    return (
        <section id={id} className="py-20 lg:py-32 bg-background scroll-mt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-primary font-semibold text-lg">
                        Meet Our Experts
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                        Our Medical Team
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        A team of more than 1,000 compassionate healthcare
                        professionals, each dedicated to providing you with the
                        highest quality medical care and personalized attention.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {doctors.map((doctor, index) => {
                        const delayStyle: CSSProperties = {
                            animationDelay: `${index * 0.1}s`,
                        };

                        return (
                            <div
                                key={doctor.name}
                                className="group text-center animate-fade-in"
                                style={delayStyle}
                            >
                                <div className="relative mb-6 overflow-hidden rounded-2xl">
                                    <Image
                                        src={doctor.image}
                                        alt={`${doctor.name} - ${doctor.specialty}`}
                                        className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                                        priority={index < 2}
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                className="w-10 h-10 bg-card/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-card transition-colors"
                                                aria-label={`Email ${doctor.name}`}
                                            ></button>

                                            <button
                                                type="button"
                                                className="w-10 h-10 bg-card/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-card transition-colors"
                                                aria-label={`Call ${doctor.name}`}
                                            ></button>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-1">
                                    {doctor.name}
                                </h3>
                                <p className="text-primary font-medium">
                                    {doctor.specialty}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default MedicalTeamSection;
