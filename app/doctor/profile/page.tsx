"use client";

import { useState } from "react";
import { Edit, Save, X, User, Mail, Phone, MapPin, Calendar, Stethoscope, Upload, FileText, Trash2 } from "lucide-react";

interface Certificate {
  id: string;
  name: string;
  file: File | null;
  url?: string;
}

interface DoctorProfile {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  experience: string;
  address: string;
  bio: string;
  education: string;
  languages: string;
  certificates: Certificate[];
}

export default function DoctorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<DoctorProfile>({
    name: "Dr. John Doe",
    email: "john.doe@hospital.com",
    phone: "09997272727",
    specialty: "Cardiologist",
    licenseNumber: "MD123456789",
    experience: "15 years",
    address: "Linh Dong, Thu Duc, Ho Chi Minh City, Vietnam",
    bio: "Experienced cardiologist with expertise in interventional cardiology and heart disease prevention.",
    education: "MD from Harvard Medical School",
    languages: "Vietnamese, English",
    certificates: [
      { id: "1", name: "Medical License Certificate.pdf", file: null, url: "/certificates/license.pdf" },
      { id: "2", name: "Board Certification.pdf", file: null, url: "/certificates/board.pdf" }
    ]
  });

  const [editedProfile, setEditedProfile] = useState<DoctorProfile>(profile);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    console.log("Profile saved:", editedProfile);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof DoctorProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newCertificates: Certificate[] = Array.from(files).map((file, index) => ({
        id: Date.now().toString() + index,
        name: file.name,
        file: file,
      }));
      
      setEditedProfile(prev => ({
        ...prev,
        certificates: [...prev.certificates, ...newCertificates]
      }));
    }
  };

  const handleRemoveCertificate = (id: string) => {
    setEditedProfile(prev => ({
      ...prev,
      certificates: prev.certificates.filter(cert => cert.id !== id)
    }));
  };

  const handleDownloadCertificate = (cert: Certificate) => {
    if (cert.url) {
      window.open(cert.url, '_blank');
    } else if (cert.file) {
      const url = URL.createObjectURL(cert.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = cert.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-6 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Doctor Profile
          </h1>
          <p className="text-gray-600">
            Manage your professional information
          </p>
        </div>
        
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#a657fb] to-[#9333ea] px-8 py-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
              <p className="text-purple-100 mb-1">{profile.specialty}</p>
              <p className="text-purple-200 text-sm">{profile.experience} of experience</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Stethoscope className="w-4 h-4" />
                  Specialty
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.specialty}
                    onChange={(e) => handleInputChange('specialty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.specialty}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Experience
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.experience}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  License Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.licenseNumber}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.address}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Education
                </label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.education}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Languages
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.languages}
                    onChange={(e) => handleInputChange('languages', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.languages}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Professional Bio
            </label>
            {isEditing ? (
              <textarea
                value={editedProfile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about your professional background and expertise..."
              />
            ) : (
              <p className="text-gray-900 leading-relaxed">{profile.bio}</p>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Professional Certificates
              </label>
              {isEditing && (
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Certificate
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {(isEditing ? editedProfile : profile).certificates.length > 0 ? (
              <div className="space-y-3">
                {(isEditing ? editedProfile : profile).certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                        <p className="text-xs text-gray-500">
                          {cert.file ? `${(cert.file.size / 1024).toFixed(2)} KB` : 'Uploaded'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadCertificate(cert)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Upload className="w-4 h-4 rotate-180" />
                      </button>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveCertificate(cert.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No certificates uploaded yet</p>
                {isEditing && (
                  <p className="text-xs mt-1">Click Upload Certificate to add your professional certificates</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}