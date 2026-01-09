"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Notification {
    id: string;
    type: string;
    channel: string | null;
    title: string;
    content: string | null;
    isRead: boolean;
    createdAt: string;
    sentAt: string;
    status: string;
}

const NotificationDropdown = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        // Fetch notifications on mount to show count
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/notifications/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            const response = await fetch(
                `/api/notifications/${notificationId}/read`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    )
                );
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMins < 1) return "Just now";
        if (diffInMins < 60) return `${diffInMins}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const getNotificationIcon = (type: string) => {
        const colors: { [key: string]: string } = {
            APPOINTMENT: "bg-blue-100 text-blue-600",
            INVOICE: "bg-green-100 text-green-600",
            DUNNING: "bg-red-100 text-red-600",
            GENERAL: "bg-gray-100 text-gray-600",
        };
        return colors[type] || colors.GENERAL;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-gray-100"
                aria-label="Notifications"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <p className="text-sm text-gray-500">
                                {unreadCount} unread
                            </p>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 px-4">
                                <Bell
                                    size={48}
                                    className="text-gray-300 mb-2"
                                />
                                <p className="text-gray-500 text-sm">
                                    No notifications yet
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() =>
                                            !notification.isRead &&
                                            markAsRead(notification.id)
                                        }
                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                            !notification.isRead
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationIcon(
                                                    notification.type
                                                )}`}
                                            >
                                                <Bell size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {notification.title}
                                                    </p>
                                                    {!notification.isRead && (
                                                        <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
                                                    )}
                                                </div>
                                                {notification.content && (
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {notification.content}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatDate(
                                                        notification.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                }}
                                className="w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
