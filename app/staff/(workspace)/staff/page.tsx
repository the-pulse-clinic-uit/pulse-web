"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import StaffProfileHeader from "@/components/staff/staff/StaffProfileHeader";
import PersonalInformationCard from "@/components/staff/staff/PersonalInformationCard";
import ProfessionalInformationCard from "@/components/staff/staff/ProfessionalInformationCard";
import EditPersonalInfoModal from "@/components/staff/staff/EditPersonalInfoModal";
import EditProfessionalInfoModal from "@/components/staff/staff/EditProfessionalInfoModal";
import Header from "@/components/staff/Header";

interface StaffDTO {
    id: string;
    position: string;
    createdAt: string;
    userDto: {
        id: string;
        email: string;
        fullName: string;
        address: string | null;
        citizenId: string;
        phone: string;
        gender: boolean;
        birthDate: string;
        avatarUrl: string | null;
        createdAt: string;
        updatedAt: string;
        isActive: boolean;
        roleDto: {
            id: string;
            name: string;
            createdAt: string;
        };
    };
    departmentDto: {
        id: string;
        name: string;
        description: string;
        createdAt: string;
    };
}

export default function StaffProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [staffApiData, setStaffApiData] = useState<StaffDTO | null>(null);
    const [staffData, setStaffData] = useState({
        name: "Loading...",
        role: "Staff",
        avatarUrl: "/images/avatar-placeholder.jpg",
        personalInfo: {
            name: "Loading...",
            dateOfBirth: "",
            age: 0,
            phoneNumber: "",
            emailAddress: "",
            address: "",
            gender: "Male",
            ethnicity: "Kinh",
        },
        professionalInfo: {
            specialty: "",
            practicingCertificate: "",
        },
    });

    const [isEditPersonalInfoOpen, setIsEditPersonalInfoOpen] = useState(false);
    const [isEditProfessionalInfoOpen, setIsEditProfessionalInfoOpen] =
        useState(false);

    useEffect(() => {
        const fetchStaffData = async () => {
            const token = Cookies.get("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch("/api/staff/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: StaffDTO = await response.json();
                    setStaffApiData(data);

                    const birthDate = new Date(data.userDto.birthDate);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (
                        monthDiff < 0 ||
                        (monthDiff === 0 &&
                            today.getDate() < birthDate.getDate())
                    ) {
                        age--;
                    }

                    // Format date to DD/MM/YYYY
                    const formattedDate = new Date(data.userDto.birthDate)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "/");

                    setStaffData({
                        name: data.userDto.fullName,
                        role: data.position,
                        avatarUrl:
                            data.userDto.avatarUrl ||
                            "/images/avatar-placeholder.jpg",
                        personalInfo: {
                            name: data.userDto.fullName,
                            dateOfBirth: formattedDate,
                            age: age,
                            phoneNumber: data.userDto.phone,
                            emailAddress: data.userDto.email,
                            address: data.userDto.address || "Not provided",
                            gender: data.userDto.gender ? "Male" : "Female",
                            ethnicity: "Kinh",
                        },
                        professionalInfo: {
                            specialty: data.departmentDto.name,
                            practicingCertificate: "",
                        },
                    });
                } else {
                    Cookies.remove("token");
                    router.push("/login");
                }
            } catch (error) {
                console.error("Failed to fetch staff data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStaffData();
    }, [router]);

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

    if (loading) {
        return (
            <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
                <Header tabName="Staff Profile" userName="Loading..." />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header
                tabName="Staff Profile"
                userName={staffData.name}
                avatarUrl={staffData.avatarUrl}
            />

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
