"use client";

import { useState, useEffect } from "react";
import ProfileSection from "./ProfileSection";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextArea";
import SaveButton from "./SaveButton";

const ProfileForm = () => {
    const [loading, setLoading] = useState(true);
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
        policyNumber: "",
        allergies: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const backendUrl =
                    process.env.NEXT_PUBLIC_BACKEND_API_URL || "localhost:8080";
                const response = await fetch(`http://${backendUrl}/users/me`, {
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

                // Update localStorage with fresh data
                localStorage.setItem("user", JSON.stringify(userData));

                // Map API data to form fields
                setFormData({
                    fullName: userData.fullName || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    citizenId: userData.citizenId || "",
                    dateOfBirth: userData.birthDate || "",
                    gender: userData.gender ? "Male" : "Female",
                    address: userData.address || "",
                    city: "",
                    bloodType: "",
                    height: "",
                    weight: "",
                    policyNumber: "",
                    allergies: "",
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Try to load from localStorage as fallback
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    try {
                        const userData = JSON.parse(userStr);
                        setFormData({
                            fullName: userData.fullName || "",
                            email: userData.email || "",
                            phone: userData.phone || "",
                            citizenId: userData.citizenId || "",
                            dateOfBirth: userData.birthDate || "",
                            gender: userData.gender ? "Male" : "Female",
                            address: userData.address || "",
                            city: "",
                            bloodType: "",
                            height: "",
                            weight: "",
                            policyNumber: "",
                            allergies: "",
                        });
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("Profile updated successfully!");
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
                    options={["Male", "Female", "Other", "Prefer not to say"]}
                />
            </ProfileSection>

            <ProfileSection title="Address">
                <FormInput
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />
                <FormInput
                    label="City"
                    name="city"
                    value={formData.city}
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
                <FormInput
                    label="Height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                />
                <FormInput
                    label="Weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
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
                    label="Policy Number"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                />
            </ProfileSection>
            <SaveButton />
        </form>
    );
};

export default ProfileForm;
