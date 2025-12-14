"use client";

interface Notification {
    id: number;
    category: string;
    message: string;
    time: string;
    date: string;
}

const notifications: Notification[] = [
    {
        id: 1,
        category: "Chat",
        message: "Patient A sent you a message.",
        time: "08:27",
        date: "Mon",
    },
    {
        id: 2,
        category: "Drug",
        message: "Paracetamol stock is low.",
        time: "08:27",
        date: "Mon",
    },
    {
        id: 3,
        category: "Patient",
        message: "Patient A cancelled the appointment.",
        time: "08:27",
        date: "Mon",
    },
    {
        id: 4,
        category: "Patient",
        message: "Patient A cancelled the appointment.",
        time: "08:27",
        date: "Mon",
    },
    {
        id: 5,
        category: "Patient",
        message: "Patient A cancelled the appointment.",
        time: "08:27",
        date: "Mon",
    },
];

const NotificationPanel = () => {
    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 h-full">
            <div className="card-body p-5 flex flex-col h-full">
                <h2 className="card-title text-xl font-semibold mb-2">
                    Notification
                </h2>

                <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] pr-1 custom-scrollbar">
                    {notifications.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors duration-200 border border-transparent hover:border-primary/10"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-base-content">
                                    {item.category}
                                </span>
                                <span className="text-xs text-base-content/60 font-medium">
                                    {item.time}, {item.date}
                                </span>
                            </div>
                            <p className="text-sm text-base-content/80 font-medium">
                                {item.message}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;
