"use client";

import React, { CSSProperties, useMemo } from "react";
import Image, { StaticImageData } from "next/image";
import Button from "@/ui_components/button";
import heroImage from "@/assets/hero_image.png";

type StatItem = {
  value: string;
  label: string;
};

type HeroSectionProps = {
  id?: string;
  heroSrc?: StaticImageData;
};

const HeroSection: React.FC<HeroSectionProps> = ({
  id = "home",
  heroSrc = heroImage,
}) => {
  const stats = useMemo<StatItem[]>(
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
    <section
      id={id}
      className="relative min-h-screen bg-hero pt-24 overflow-hidden scroll-mt-24"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft"
          style={delay1s}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)] py-12">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                Welcome to The Pulse Clinic
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Health is the foundation of{" "}
                <span className="text-gradient">happiness!</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                We provide healthcare services with dignity, compassion, and unwavering support.
                Your well-being is our priority, and we&apos;re here to guide you on your journey to
                better health.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Book Appointment */}
              <Button
                variant="hero"
                size="xl"
                type="button"
                className="
                  transition-all
                  shadow-md
                  hover:shadow-xl
                  hover:brightness-105
                  active:scale-95
                  focus-visible:ring-2 focus-visible:ring-primary
                "
              >
                Book Appointment
              </Button>

              {/* Learn More → scroll to AboutSection */}
              <a href="#about">
                <Button
                  variant="outline"
                  size="xl"
                  type="button"
                  className="
                    w-full
                    transition-all
                    hover:bg-primary/10
                    active:scale-95
                    focus-visible:ring-2 focus-visible:ring-primary
                  "
                >
                  Learn More
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
              {stats.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-3xl font-bold text-primary">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div
            className="relative flex justify-center lg:justify-end animate-fade-in-right"
            style={delay03s}
          >
            <div className="relative">
              <Image
                src={heroSrc}
                alt="Doctor caring for patient - professional healthcare services"
                className="w-full max-w-2xl rounded-3xl shadow-2xl animate-float"
                priority
              />
            </div>
          </div>
          {/* End Hero Image */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
