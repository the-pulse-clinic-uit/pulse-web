import {
    LayoutDashboard,
    Calendar,
    User,
    MessageSquare,
    Bell,
    Stethoscope,
    Users,
} from "lucide-react";

export const MENU_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Schedule", href: "/schedule", icon: Bell },
    { label: "Manage Appointment", href: "/appointments", icon: Calendar },
    { label: "Chat with patient", href: "/chat", icon: MessageSquare },
    { label: "Manage Encounter", href: "/encounters", icon: Stethoscope },
    { label: "Doctor Profile", href: "/profile", icon: Users },
];
