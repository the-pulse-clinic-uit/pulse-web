"use client";

import { useState } from "react";
import { User, MapPin, Heart, AlertCircle, Save } from "lucide-react";

interface User {
  name: string;
  email: string;
}

interface Props {
  user: User;
}

export default function PatientProfileForm({ user }: Props) {
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Sarah Johnson',
    email: user?.email || 'sarah.johnson@email.com',
    phone: '0777929292',
    dateOfBirth: '1990-05-15',
    gender: 'Female',
    address: 'Thu Duc, Ho Chi Minh City',
    city: 'Ho Chi Minh City',
    state: 'HCM',
    zipCode: '700000',
    bloodType: 'O+',
    height: '175',
    weight: '70',
    insurance: 'Blue Cross Blue Shield',
    policyNumber: 'BCBS-123456789',
    emergencyContact: 'John Johnson',
    emergencyPhone: '0777989898',
    allergies: 'Penicillin, Peanuts',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-purple-900 mb-1">My Profile</h1>
          <p className="text-gray-600 text-sm">Manage your personal and medical information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h2 className="text-purple-900 mb-4 text-lg font-medium flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h2 className="text-purple-900 mb-4 text-lg font-medium flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1 text-sm">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h2 className="text-purple-900 mb-4 text-lg font-medium flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Medical Info
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Blood Type</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                  >
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="175"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="70"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    Allergies
                  </label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    placeholder="List any known allergies..."
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <h2 className="text-purple-900 mb-4 text-lg font-medium">Insurance</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Provider</label>
                    <input
                      type="text"
                      name="insurance"
                      value={formData.insurance}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Policy Number</label>
                    <input
                      type="text"
                      name="policyNumber"
                      value={formData.policyNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <h2 className="text-purple-900 mb-4 text-lg font-medium">Emergency Contact</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}