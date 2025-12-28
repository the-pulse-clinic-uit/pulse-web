"use client";

import jsPDF from "jspdf";

interface PatientData {
    name: string;
    email: string;
    password: string;
    citizenId: string;
    phoneNumber: string;
    birthDate: string;
    gender: string;
    healthInsuranceId: string;
    bloodType?: string;
    allergies?: string;
}

export const generatePatientCredentialsPDF = (patientData: PatientData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header - Hospital Logo/Title
    doc.setFillColor(139, 92, 246); // Purple color
    doc.rect(0, 0, pageWidth, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PULSE HOSPITAL", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Patient Registration Confirmation", pageWidth / 2, 25, {
        align: "center",
    });

    // Reset text color for body
    doc.setTextColor(0, 0, 0);

    // Date and Time
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${currentDate} at ${currentTime}`, 15, 45);

    // Important Notice Box
    doc.setFillColor(255, 243, 205); // Light yellow
    doc.rect(15, 55, pageWidth - 30, 25, "F");
    doc.setDrawColor(234, 179, 8); // Yellow border
    doc.rect(15, 55, pageWidth - 30, 25, "S");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("IMPORTANT: Keep this document secure!", 20, 63);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
        "This document contains your login credentials. Please store it safely.",
        20,
        70
    );
    doc.text(
        "You can use these credentials to access the patient portal.",
        20,
        75
    );

    // Patient Information Section
    let yPos = 95;

    // Section Title
    doc.setFillColor(249, 250, 251); // Light gray background
    doc.rect(15, yPos, pageWidth - 30, 10, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 246); // Purple
    doc.text("PATIENT INFORMATION", 20, yPos + 7);

    yPos += 18;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    // Patient Details - Two columns layout
    const leftCol = 20;
    const rightCol = pageWidth / 2 + 10;
    const lineHeight = 8;

    // Left column
    doc.setFont("helvetica", "bold");
    doc.text("Full Name:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(patientData.name, leftCol + 35, yPos);

    doc.setFont("helvetica", "bold");
    doc.text("Citizen ID:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(patientData.citizenId, rightCol + 35, yPos);

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Date of Birth:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
        new Date(patientData.birthDate).toLocaleDateString("en-US"),
        leftCol + 35,
        yPos
    );

    doc.setFont("helvetica", "bold");
    doc.text("Gender:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(patientData.gender, rightCol + 35, yPos);

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Phone Number:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(patientData.phoneNumber, leftCol + 35, yPos);

    doc.setFont("helvetica", "bold");
    doc.text("Email:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(patientData.email, rightCol + 35, yPos);

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Insurance ID:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(patientData.healthInsuranceId, leftCol + 35, yPos);

    if (patientData.bloodType) {
        doc.setFont("helvetica", "bold");
        doc.text("Blood Type:", rightCol, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(patientData.bloodType, rightCol + 35, yPos);
        yPos += lineHeight;
    }

    if (patientData.allergies) {
        doc.setFont("helvetica", "bold");
        doc.text("Allergies:", leftCol, yPos);
        doc.setFont("helvetica", "normal");
        const allergiesText = doc.splitTextToSize(
            patientData.allergies,
            pageWidth - 70
        );
        doc.text(allergiesText, leftCol + 35, yPos);
        yPos += lineHeight * Math.max(1, allergiesText.length);
    }

    // Login Credentials Section
    yPos += 10;
    doc.setFillColor(254, 242, 242); // Light red/pink background
    doc.rect(15, yPos, pageWidth - 30, 10, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38); // Red
    doc.text("LOGIN CREDENTIALS", 20, yPos + 7);

    yPos += 18;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    // Credentials box with border
    const credBoxY = yPos - 5;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.5);
    doc.rect(15, credBoxY, pageWidth - 30, 25, "FD");

    doc.setFont("helvetica", "bold");
    doc.text("Email/Username:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(patientData.email, leftCol + 40, yPos);

    yPos += lineHeight + 2;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Password:", leftCol, yPos);
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    doc.setTextColor(220, 38, 38);
    doc.text(patientData.password, leftCol + 40, yPos);

    // Instructions Section
    yPos += 20;
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(239, 246, 255); // Light blue
    doc.rect(15, yPos, pageWidth - 30, 10, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235); // Blue
    doc.text("NEXT STEPS", 20, yPos + 7);

    yPos += 18;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const instructions = [
        "1. Visit the patient portal at: [Your Hospital Website]",
        "2. Click on 'Login' and enter your email and password above",
        "3. For security, please change your password after first login",
        "4. You can book appointments, view medical records, and more",
    ];

    instructions.forEach((instruction, index) => {
        doc.text(instruction, leftCol, yPos + index * 6);
    });

    // Footer
    const footerY = pageHeight - 25;
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, pageWidth - 15, footerY);

    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128); // Gray
    doc.setFont("helvetica", "italic");
    doc.text(
        "This is a computer-generated document. No signature is required.",
        pageWidth / 2,
        footerY + 6,
        { align: "center" }
    );
    doc.text(
        "For any queries, please contact PULSE Hospital Reception",
        pageWidth / 2,
        footerY + 11,
        { align: "center" }
    );

    return doc;
};

export const downloadPDF = (patientData: PatientData) => {
    const doc = generatePatientCredentialsPDF(patientData);
    const fileName = `Patient_Credentials_${patientData.name.replace(
        / /g,
        "_"
    )}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
};

export const printPDF = (patientData: PatientData) => {
    const doc = generatePatientCredentialsPDF(patientData);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const printWindow = window.open(pdfUrl);
    if (printWindow) {
        printWindow.onload = () => {
            printWindow.print();
            URL.revokeObjectURL(pdfUrl);
        };
    }
};
