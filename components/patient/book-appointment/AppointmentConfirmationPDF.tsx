"use client";

import jsPDF from "jspdf";

interface AppointmentData {
    appointmentId: string;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    doctorName: string;
    departmentName: string;
    date: string;
    startTime: string;
    endTime: string;
    description?: string;
    status: string;
}

export const generateAppointmentPDF = (appointmentData: AppointmentData) => {
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
    doc.text("Appointment Confirmation", pageWidth / 2, 25, {
        align: "center",
    });

    // Reset text color for body
    doc.setTextColor(0, 0, 0);

    // Date and Time of generation
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

    // Appointment ID Box
    doc.setFillColor(239, 246, 255); // Light blue
    doc.rect(15, 52, pageWidth - 30, 18, "F");
    doc.setDrawColor(59, 130, 246); // Blue border
    doc.setLineWidth(0.5);
    doc.rect(15, 52, pageWidth - 30, 18, "S");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text("APPOINTMENT ID", 20, 60);
    doc.setFontSize(14);
    doc.setFont("courier", "bold");
    doc.text(`#${appointmentData.appointmentId.substring(0, 8).toUpperCase()}`, 20, 67);

    // Status badge
    const statusColors: Record<string, { bg: number[]; text: number[] }> = {
        PENDING: { bg: [254, 243, 199], text: [180, 83, 9] },
        APPROVED: { bg: [220, 252, 231], text: [22, 101, 52] },
        CONFIRMED: { bg: [220, 252, 231], text: [22, 101, 52] },
        COMPLETED: { bg: [219, 234, 254], text: [30, 64, 175] },
        CANCELLED: { bg: [254, 226, 226], text: [185, 28, 28] },
    };
    const statusColor = statusColors[appointmentData.status] || statusColors.PENDING;

    doc.setFillColor(statusColor.bg[0], statusColor.bg[1], statusColor.bg[2]);
    doc.roundedRect(pageWidth - 55, 55, 40, 12, 2, 2, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(statusColor.text[0], statusColor.text[1], statusColor.text[2]);
    doc.text(appointmentData.status, pageWidth - 35, 62.5, { align: "center" });

    // Patient Information Section
    let yPos = 85;

    doc.setFillColor(249, 250, 251);
    doc.rect(15, yPos, pageWidth - 30, 10, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 246);
    doc.text("PATIENT INFORMATION", 20, yPos + 7);

    yPos += 18;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    const leftCol = 20;
    const rightCol = pageWidth / 2 + 10;
    const lineHeight = 8;

    doc.setFont("helvetica", "bold");
    doc.text("Patient Name:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(appointmentData.patientName, leftCol + 35, yPos);

    doc.setFont("helvetica", "bold");
    doc.text("Phone:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(appointmentData.patientPhone, rightCol + 25, yPos);

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Email:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(appointmentData.patientEmail, leftCol + 35, yPos);

    // Appointment Details Section
    yPos += 15;
    doc.setFillColor(249, 250, 251);
    doc.rect(15, yPos, pageWidth - 30, 10, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 246);
    doc.text("APPOINTMENT DETAILS", 20, yPos + 7);

    yPos += 18;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    doc.setFont("helvetica", "bold");
    doc.text("Doctor:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(appointmentData.doctorName, leftCol + 35, yPos);

    doc.setFont("helvetica", "bold");
    doc.text("Department:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(appointmentData.departmentName, rightCol + 30, yPos);

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Date:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(appointmentData.date, leftCol + 35, yPos);

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Time:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${appointmentData.startTime} - ${appointmentData.endTime}`, leftCol + 35, yPos);

    doc.setFont("helvetica", "bold");
    doc.text("Duration:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text("30 minutes", rightCol + 25, yPos);

    // Description if exists
    if (appointmentData.description) {
        yPos += lineHeight + 5;
        doc.setFont("helvetica", "bold");
        doc.text("Description/Notes:", leftCol, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");
        const descriptionLines = doc.splitTextToSize(
            appointmentData.description,
            pageWidth - 45
        );
        doc.text(descriptionLines, leftCol, yPos);
        yPos += descriptionLines.length * 5;
    }

    // Important Notice Box
    yPos += 15;
    doc.setFillColor(255, 243, 205); // Light yellow
    doc.rect(15, yPos, pageWidth - 30, 30, "F");
    doc.setDrawColor(234, 179, 8); // Yellow border
    doc.setLineWidth(0.5);
    doc.rect(15, yPos, pageWidth - 30, 30, "S");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("IMPORTANT REMINDERS", 20, yPos + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text("- Please arrive 15 minutes before your scheduled appointment time.", 20, yPos + 16);
    doc.text("- Bring this confirmation and a valid ID document.", 20, yPos + 22);
    doc.text("- Contact us at least 24 hours in advance if you need to reschedule.", 20, yPos + 28);

    // QR Code placeholder area (optional, for future enhancement)
    // You could add a QR code library to generate a scannable code

    // Footer
    const footerY = pageHeight - 25;
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, pageWidth - 15, footerY);

    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
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

export const downloadAppointmentPDF = (appointmentData: AppointmentData) => {
    const doc = generateAppointmentPDF(appointmentData);
    const fileName = `Appointment_${appointmentData.appointmentId.substring(0, 8)}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
};

export const printAppointmentPDF = (appointmentData: AppointmentData) => {
    const doc = generateAppointmentPDF(appointmentData);
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
