"use client";
import { LogOut } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { MENU_ITEMS } from "@/constants/staff-menu-items";

const Sidebar = () => {
    return (
        <aside className="h-screen w-72 bg-base-100 border-r border-base-300 flex flex-col sticky top-0 overflow-hidden">
            <div className="p-6 flex items-center justify-center border-b border-base-200">
                <div className="avatar">
                    <div className="w-16 rounded">
                        <img
                            src="/images/logo.png"
                            alt="Clinic Logo"
                            className="object-contain w-16 h-16"
                        />
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                <ul className="menu w-full gap-1">
                    {MENU_ITEMS.map((item, index) => (
                        <SidebarItem
                            key={index}
                            label={item.label}
                            href={item.href}
                            icon={item.icon}
                        />
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-base-200 bg-base-100">
                <ul className="menu w-full">
                    <li>
                        <button className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 hover:text-error rounded-lg font-medium">
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
