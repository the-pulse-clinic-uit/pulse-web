"use client";
import { useState } from "react";
import StaffProfileHeader from "@/components/staff/staff/StaffProfileHeader";
import PersonalInformationCard from "@/components/staff/staff/PersonalInformationCard";
import ProfessionalInformationCard from "@/components/staff/staff/ProfessionalInformationCard";
import Header from "@/components/staff/Header";

export default function StaffProfilePage() {
    const [staffData] = useState({
        name: "Nguyen Van A",
        role: "Staff",
        avatarUrl: "/images/avatar-placeholder.jpg",
        personalInfo: {
            name: "Nguyen Van A",
            dateOfBirth: "07/01/1997",
            age: 26,
            phoneNumber: "0756348223",
            emailAddress: "nguyenvana@gmail.com",
            address: "Thu Duc, HCM City",
            gender: "Male",
            ethnicity: "Kinh",
        },
        professionalInfo: {
            specialty: "Internal Medicine",
            practicingCertificate: "",
        },
    });

    const handleEditProfile = () => {
        console.log("Edit profile");
    };

    const handleEditPersonalInfo = () => {
        console.log("Edit personal information");
    };

    const handleEditProfessionalInfo = () => {
        console.log("Edit professional information");
    };

    const handleDetailUpdateCertificate = () => {
        console.log("Detail/Update certificate");
    };

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Manage Patients" userName="Nguyen Huu Duy" />

            <div className="w-full space-y-6">
                <StaffProfileHeader
                    name={staffData.name}
                    role={staffData.role}
                    avatarUrl={staffData.avatarUrl}
                    onEdit={handleEditProfile}
                />

                <PersonalInformationCard
                    data={staffData.personalInfo}
                    onEdit={handleEditPersonalInfo}
                />

                <ProfessionalInformationCard
                    data={staffData.professionalInfo}
                    onEdit={handleEditProfessionalInfo}
                    onDetailUpdate={handleDetailUpdateCertificate}
                />
            </div>
        </div>
    );
}
