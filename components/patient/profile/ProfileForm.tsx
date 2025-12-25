"use client";

import { useState } from "react";
import ProfileSection from "./ProfileSection";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextArea";
import SaveButton from "./SaveButton";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "0777929292",
    dateOfBirth: "1990-05-15",
    gender: "Female",
    address: "Thu Duc, Ho Chi Minh City",
    city: "Ho Chi Minh City",
    state: "HCM",
    zipCode: "700000",
    bloodType: "O+",
    height: "170 cm",
    weight: "65 kg",
    insurance: "Blue Cross Blue Shield",
    policyNumber: "BCBS-123456789",
    emergencyContact: "John Johnson",
    emergencyPhone: "0777989898",
    allergies: "Penicillin, Peanuts",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <ProfileSection title="Personal Information">
        <FormInput label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <FormInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
        <FormInput label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
        <FormSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange}
          options={["Male", "Female", "Other", "Prefer not to say"]}
        />
      </ProfileSection>

      <ProfileSection title="Address">
        <FormInput label="Street Address" name="address" value={formData.address} onChange={handleChange} />
        <FormInput label="City" name="city" value={formData.city} onChange={handleChange} />
        <FormInput label="State" name="state" value={formData.state} onChange={handleChange} />
        <FormInput label="ZIP Code" name="zipCode" value={formData.zipCode} onChange={handleChange} />
      </ProfileSection>

      <ProfileSection title="Medical Information">
        <FormSelect label="Blood Type" name="bloodType" value={formData.bloodType} onChange={handleChange}
          options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
        />
        <FormInput label="Height" name="height" value={formData.height} onChange={handleChange} />
        <FormInput label="Weight" name="weight" value={formData.weight} onChange={handleChange} />
        <FormTextarea label="Known Allergies" name="allergies" value={formData.allergies} onChange={handleChange} />
      </ProfileSection>

      <ProfileSection title="Insurance Information">
        <FormInput label="Insurance Provider" name="insurance" value={formData.insurance} onChange={handleChange} />
        <FormInput label="Policy Number" name="policyNumber" value={formData.policyNumber} onChange={handleChange} />
      </ProfileSection>

      <ProfileSection title="Emergency Contact">
        <FormInput label="Contact Name" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
        <FormInput label="Contact Phone" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} />
      </ProfileSection>

      <SaveButton />
    </form>
  );
};

export default ProfileForm;
