import Image from "next/image";

interface HeaderProps {
    userName?: string;
    avatarUrl?: string;
}

const DashboardHeader = ({ userName, avatarUrl }: HeaderProps) => {
    const displayName = userName || "Staff Member";
    const displayAvatar = avatarUrl || "/images/default-avatar.png";

    return (
        <header className="flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-sm text-base-content/70">
                    Hi, {displayName}!
                </span>
                <h1 className="text-2xl font-bold text-base-content">
                    Welcome Back
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <div className="avatar">
                    <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden relative">
                        <Image
                            src={displayAvatar}
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                </div>

                <span className="font-semibold text-base-content hidden md:block">
                    {displayName}
                </span>
            </div>
        </header>
    );
};

export default DashboardHeader;
