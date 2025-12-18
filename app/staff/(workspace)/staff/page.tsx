"use client";
import { useState } from "react";
import StaffProfileHeader from "@/components/staff/staff/StaffProfileHeader";
import PersonalInformationCard from "@/components/staff/staff/PersonalInformationCard";
import ProfessionalInformationCard from "@/components/staff/staff/ProfessionalInformationCard";
import EditPersonalInfoModal from "@/components/staff/staff/EditPersonalInfoModal";
import EditProfessionalInfoModal from "@/components/staff/staff/EditProfessionalInfoModal";
import Header from "@/components/staff/Header";

export default function StaffProfilePage() {
    const [staffData, setStaffData] = useState({
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

    const [isEditPersonalInfoOpen, setIsEditPersonalInfoOpen] = useState(false);
    const [isEditProfessionalInfoOpen, setIsEditProfessionalInfoOpen] =
        useState(false);

    const handleSavePersonalInfo = (data: {
        name: string;
        dateOfBirth: string;
        age: number;
        phoneNumber: string;
        emailAddress: string;
        address: string;
        gender: string;
        ethnicity: string;
    }) => {
        setStaffData((prev) => ({
            ...prev,
            name: data.name,
            personalInfo: data,
        }));
    };

    const handleSaveProfessionalInfo = (data: {
        specialty: string;
        practicingCertificate?: string;
    }) => {
        setStaffData((prev) => ({
            ...prev,
            professionalInfo: {
                specialty: data.specialty,
                practicingCertificate: data.practicingCertificate || "",
            },
        }));
    };

    const handleDetailUpdateCertificate = () => {
        setIsEditProfessionalInfoOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header tabName="Manage Patients" userName="Nguyen Huu Duy" />

            <div className="w-full space-y-6">
                <StaffProfileHeader
                    name={staffData.name}
                    role={staffData.role}
                    avatarUrl={staffData.avatarUrl}
                />

                <PersonalInformationCard
                    data={staffData.personalInfo}
                    onEdit={() => setIsEditPersonalInfoOpen(true)}
                />

                <ProfessionalInformationCard
                    data={staffData.professionalInfo}
                    onEdit={() => setIsEditProfessionalInfoOpen(true)}
                    onDetailUpdate={handleDetailUpdateCertificate}
                />
            </div>

            <EditPersonalInfoModal
                isOpen={isEditPersonalInfoOpen}
                onClose={() => setIsEditPersonalInfoOpen(false)}
                onSave={handleSavePersonalInfo}
                currentData={staffData.personalInfo}
            />

            <EditProfessionalInfoModal
                isOpen={isEditProfessionalInfoOpen}
                onClose={() => setIsEditProfessionalInfoOpen(false)}
                onSave={handleSaveProfessionalInfo}
                currentData={staffData.professionalInfo}
            />
        </div>
    );
}
