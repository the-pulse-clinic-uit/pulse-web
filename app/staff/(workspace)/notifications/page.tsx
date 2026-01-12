"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SendEmailForm from "@/components/staff/notifications/SendEmailForm";
import TemplateList from "@/components/staff/notifications/TemplateList";
import Header from "@/components/staff/Header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

type Template = {
    id: string;
    title: string;
    description: string;
};

interface PatientDTO {
    id: string;
    userDto: {
        id: string;
        fullName: string;
        birthDate: string;
        gender: boolean;
        phone: string;
        email: string;
        address: string;
        citizenId: string;
    };
    healthInsuranceId: string | null;
    bloodType: string;
    allergies: string;
}

type PatientOption = {
    id: string;
    userId: string;
    name: string;
    email: string;
};

const mockTemplates: Template[] = [
    {
        id: "1",
        title: "Appointment Reminder",
        description: "Send an appointment reminder to the patient",
    },
    {
        id: "2",
        title: "Invoice Reminder",
        description: "Send an invoice reminder to the patient",
    },
    {
        id: "3",
        title: "Dunning Notice",
        description: "Send a dunning notice to the patient",
    },
    {
        id: "4",
        title: "General Notification",
        description: "Send a general notification to the patient",
    },
];

export default function NotificationsPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        mockTemplates[0]
    );
    const [patients, setPatients] = useState<PatientOption[]>([]);

    useEffect(() => {
        const token = Cookies.get("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const userResponse = await fetch("/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                } else {
                    Cookies.remove("token");
                    router.push("/login");
                    return;
                }

                const patientsResponse = await fetch("/api/patients", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (patientsResponse.ok) {
                    const patientsData = await patientsResponse.json();
                    const formattedPatients: PatientOption[] = patientsData.map(
                        (patient: PatientDTO) => ({
                            id: patient.id,
                            userId: patient.userDto.id,
                            name: patient.userDto.fullName,
                            email: patient.userDto.email,
                        })
                    );
                    setPatients(formattedPatients);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleCancel = () => {
        console.log("Cancel email");
    };

    const handleSend = async (data: {
        patient: string;
        template: string;
        subject: string;
        content: string;
    }) => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const selectedPatient = patients.find((p) => p.id === data.patient);
        if (!selectedPatient) {
            toast.error("Selected patient not found");
            return;
        }

        const typeMap: { [key: string]: string } = {
            "Appointment Reminder": "APPOINTMENT",
            "Invoice Reminder": "INVOICE",
            "Dunning Notice": "DUNNING",
            "General Notification": "GENERAL",
        };

        const notificationType = typeMap[data.template] || "GENERAL";

        try {
            const notificationBody = {
                userId: selectedPatient.userId,
                title: data.subject,
                content: data.content,
                type: notificationType,
            };

            const response = await fetch("/api/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(notificationBody),
            });

            if (response.ok) {
                toast.success("Notification sent successfully!");
            } else {
                const error = await response.json();
                toast.error(error.message || "Failed to send notification");
            }
        } catch (error) {
            console.error("Failed to send notification:", error);
            toast.error("Failed to send notification");
        }
    };

    const handleSelectTemplate = (template: Template) => {
        setSelectedTemplate(template);
    };

    const handleCreateTemplate = () => {
        console.log("Create new template");
    };

    return (
        <div className="flex flex-col gap-6 min-h-screen px-6 py-8 bg-white">
            <Header
                tabName="Send Notifications"
                userName={user?.fullName}
                avatarUrl={user?.avatarUrl}
            ></Header>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-2 gap-6">
                    <SendEmailForm
                        selectedTemplate={selectedTemplate?.title}
                        patients={patients}
                        onCancel={handleCancel}
                        onSend={handleSend}
                    />
                    <TemplateList
                        templates={mockTemplates}
                        selectedTemplateId={selectedTemplate?.id}
                        onSelectTemplate={handleSelectTemplate}
                    />
                </div>
            </div>
        </div>
    );
}
