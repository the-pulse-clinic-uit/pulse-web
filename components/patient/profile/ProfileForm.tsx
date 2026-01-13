"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ProfileSection from "./ProfileSection";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextArea";

import SaveButton from "./SaveButton";
import { toast } from "react-hot-toast";

const ProfileForm = () => {
    const [loading, setLoading] = useState(true);
    const [patientId, setPatientId] = useState<string>("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        citizenId: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        bloodType: "",
        height: "",
        weight: "",
        healthInsuranceId: "",
        allergies: "",
    });

    // Helper function to load user data from an object
    const loadUserDataFromObject = (patientData: {
        id: string;
        bloodType?: string;
        healthInsuranceId?: string;
        allergies?: string;
        userDto?: {
            fullName?: string;
            email?: string;
            phone?: string;
            citizenId?: string;
            birthDate?: string;
            gender?: boolean;
            address?: string;
        };
    }) => {
        setPatientId(patientData.id);

        const bloodTypeMap: { [key: string]: string } = {
            A: "A+",
            A_neg: "A-",
            B: "B+",
            B_neg: "B-",
            AB: "AB+",
            AB_neg: "AB-",
            O: "O+",
            O_neg: "O-",
        };

        setFormData({
            fullName: patientData.userDto?.fullName || "",
            email: patientData.userDto?.email || "",
            phone: patientData.userDto?.phone || "",
            citizenId: patientData.userDto?.citizenId || "",
            dateOfBirth: patientData.userDto?.birthDate || "",
            gender: patientData.userDto?.gender ? "Male" : "Female",
            address: patientData.userDto?.address || "",
            city: "",
            bloodType:
                (patientData.bloodType &&
                    bloodTypeMap[patientData.bloodType]) ||
                "",
            height: "",
            weight: "",
            healthInsuranceId: patientData.healthInsuranceId || "",
            allergies: patientData.allergies || "",
        });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const response = await fetch("/api/users/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const userData = await response.json();

                const patientData = {
                    id: userData.patientDto?.id || userData.id,
                    bloodType: userData.patientDto?.bloodType,
                    healthInsuranceId: userData.patientDto?.healthInsuranceId,
                    allergies: userData.patientDto?.allergies,
                    userDto: {
                        fullName: userData.fullName,
                        email: userData.email,
                        phone: userData.phone,
                        citizenId: userData.citizenId,
                        birthDate: userData.birthDate,
                        gender: userData.gender,
                        address: userData.address,
                    },
                };

                Cookies.set("user", JSON.stringify(patientData), {
                    expires: 7,
                });

                loadUserDataFromObject(patientData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                // If fetch fails, try to load from cookies as fallback
                const userStr = Cookies.get("user");
                if (userStr) {
                    try {
                        const patientData = JSON.parse(userStr);
                        loadUserDataFromObject(patientData);
                    } catch (parseError) {
                        console.error("Error parsing user data:", parseError);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = Cookies.get("token");
            if (!token) throw new Error("No authentication token found");

            // Validate patient ID is present
            if (!patientId) {
                toast.error(
                    "Patient information not loaded. Please refresh the page."
                );
                return;
            }

            const bloodTypeReverseMap: { [key: string]: string } = {
                "A+": "A",
                "A-": "A_neg",
                "B+": "B",
                "B-": "B_neg",
                "AB+": "AB",
                "AB-": "AB_neg",
                "O+": "O",
                "O-": "O_neg",
            };

            const userPayload = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                citizenId: formData.citizenId,
                birthDate: formData.dateOfBirth,
                gender: formData.gender === "Male",
                address: formData.address,
            };

            const patientPayload = {
                id: patientId,
                healthInsuranceId: formData.healthInsuranceId,
                bloodType:
                    bloodTypeReverseMap[formData.bloodType] ||
                    formData.bloodType,
                allergies: formData.allergies,
            };

            // Update user information
            const userResponse = await fetch("/api/users/me", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userPayload),
            });

            if (!userResponse.ok)
                throw new Error("Failed to update user profile");

            // Update patient information
            const patientResponse = await fetch("/api/patients/me", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(patientPayload),
            });

            if (!patientResponse.ok)
                throw new Error("Failed to update patient profile");

            const updatedPatient = await patientResponse.json();
            Cookies.set("user", JSON.stringify(updatedPatient), { expires: 7 });
            toast.success("Profile updated successfully!");
        } catch {
            toast.error("Failed to update profile. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <ProfileSection title="Personal Information">
                <FormInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                />
                <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <FormInput
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <FormInput
                    label="Citizen ID"
                    name="citizenId"
                    value={formData.citizenId}
                    onChange={handleChange}
                />
                <FormInput
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                />
                <FormSelect
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={["Male", "Female", "Other"]}
                />
            </ProfileSection>

            <ProfileSection title="Address">
                <FormInput
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />
            </ProfileSection>

            <ProfileSection title="Medical Information">
                <FormSelect
                    label="Blood Type"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                />
                <FormTextarea
                    label="Known Allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                />
            </ProfileSection>

            <ProfileSection title="Insurance Information">
                <FormInput
                    label="Insurance ID"
                    name="healthInsuranceId"
                    value={formData.healthInsuranceId}
                    onChange={handleChange}
                />
            </ProfileSection>
            <SaveButton />
        </form>
    );
};

export default ProfileForm;
