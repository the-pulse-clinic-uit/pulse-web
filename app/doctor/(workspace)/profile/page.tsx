"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import DoctorProfileHeader from "@/components/doctor/profile/DoctorProfileHeader";
import DoctorPersonalInformationCard from "@/components/doctor/profile/DoctorPersonalInformationCard";
import DoctorProfessionalInformationCard from "@/components/doctor/profile/DoctorProfessionalInformationCard";
import EditDoctorPersonalInfoModal from "@/components/doctor/profile/EditDoctorPersonalInfoModal";

interface DoctorDTO {
    id: string;
    licenseId: string;
    isVerified: boolean;
    createdAt: string;
    staffDto: {
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
        };
        departmentDto: {
            id: string;
            name: string;
            description: string;
            createdAt: string;
        };
    };
}

export default function DoctorProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [doctorApiData, setDoctorApiData] = useState<DoctorDTO | null>(null);
    const [doctorData, setDoctorData] = useState({
        name: "Loading...",
        role: "Doctor",
        avatarUrl: "/images/avatar-placeholder.jpg",
        personalInfo: {
            name: "Loading...",
            dateOfBirth: "",
            phoneNumber: "",
            emailAddress: "",
            address: "",
            gender: "Male",
            citizenId: "",
        },
        professionalInfo: {
            specialty: "",
            licenseNumber: "",
        },
    });

    const [isEditPersonalInfoOpen, setIsEditPersonalInfoOpen] = useState(false);
    const [isEditProfessionalInfoOpen, setIsEditProfessionalInfoOpen] =
        useState(false);

    useEffect(() => {
        const fetchDoctorData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch("/api/doctors/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: DoctorDTO = await response.json();
                    setDoctorApiData(data);

                    const formattedDate = new Date(
                        data.staffDto.userDto.birthDate
                    )
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "/");

                    setDoctorData({
                        name: data.staffDto.userDto.fullName,
                        role: data.staffDto.position,
                        avatarUrl:
                            data.staffDto.userDto.avatarUrl ||
                            "/images/avatar-placeholder.jpg",
                        personalInfo: {
                            name: data.staffDto.userDto.fullName,
                            dateOfBirth: formattedDate,
                            phoneNumber: data.staffDto.userDto.phone,
                            emailAddress: data.staffDto.userDto.email,
                            address:
                                data.staffDto.userDto.address || "Not provided",
                            gender: data.staffDto.userDto.gender
                                ? "Male"
                                : "Female",
                            citizenId: data.staffDto.userDto.citizenId,
                        },
                        professionalInfo: {
                            specialty: data.staffDto.departmentDto.name,
                            licenseNumber: data.licenseId,
                        },
                    });
                } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    router.push("/login");
                }
            } catch (error) {
                console.error("Failed to fetch doctor data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorData();
    }, [router]);

    const handleSavePersonalInfo = async (data: {
        name: string;
        dateOfBirth: string;
        phoneNumber: string;
        emailAddress: string;
        address: string;
        gender: string;
        citizenId: string;
    }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const [day, month, year] = data.dateOfBirth.split("/");
            const isoDate = `${year}-${month}-${day}`;

            const userPayload = {
                fullName: data.name,
                email: data.emailAddress,
                phone: data.phoneNumber,
                citizenId: data.citizenId,
                birthDate: isoDate,
                gender: data.gender === "Male",
                address: data.address,
            };

            const response = await fetch("/api/users/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userPayload),
            });

            if (response.ok) {
                toast.success("Personal information updated successfully!");

                setDoctorData((prev) => ({
                    ...prev,
                    name: data.name,
                    personalInfo: {
                        ...data,
                    },
                }));

                const doctorResponse = await fetch("/api/doctors/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (doctorResponse.ok) {
                    const updatedDoctorData: DoctorDTO =
                        await doctorResponse.json();
                    setDoctorApiData(updatedDoctorData);
                }

                setIsEditPersonalInfoOpen(false);
            } else {
                const error = await response.json();
                toast.error(
                    error.message || "Failed to update personal information"
                );
            }
        } catch (error) {
            console.error("Failed to update personal information:", error);
            toast.error("Failed to update personal information");
        }
    };

    const handleAvatarUpdate = (newAvatarUrl: string) => {
        setDoctorData((prev) => ({
            ...prev,
            avatarUrl: newAvatarUrl,
        }));
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-base-content">
                    Doctor Profile
                </h1>
            </div>

            <div className="w-full space-y-6">
                <DoctorProfileHeader
                    name={doctorData.name}
                    role={doctorData.role}
                    avatarUrl={doctorData.avatarUrl}
                    onAvatarUpdate={handleAvatarUpdate}
                />

                <DoctorPersonalInformationCard
                    data={doctorData.personalInfo}
                    onEdit={() => setIsEditPersonalInfoOpen(true)}
                />

                <DoctorProfessionalInformationCard
                    data={doctorData.professionalInfo}
                    onEdit={() => setIsEditProfessionalInfoOpen(true)}
                />
            </div>

            <EditDoctorPersonalInfoModal
                isOpen={isEditPersonalInfoOpen}
                onClose={() => setIsEditPersonalInfoOpen(false)}
                onSave={handleSavePersonalInfo}
                currentData={doctorData.personalInfo}
            />
        </div>
    );
}
