"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
    label: string;
    href: string;
    icon: LucideIcon;
}

const SidebarItem = ({ label, href, icon: Icon }: SidebarItemProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <li>
            <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200
          ${
              isActive
                  ? "bg-primary text-primary-content rounded-lg shadow-md"
                  : "text-base-content hover:bg-base-200 rounded-lg"
          }`}
            >
                <Icon size={20} />
                <span className="truncate">{label}</span>
            </Link>
        </li>
    );
};

export default SidebarItem;
