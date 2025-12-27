import ProfileHeader from "@/components/patient/profile/ProfileHeader";
import ProfileForm from "@/components/patient/profile/ProfileForm";
import AvatarSection from "@/components/patient/profile/AvatarSection";
import ToastProvider from "@/components/common/ToastProvider";

const ProfilePage = () => {
    return (
        <>
            <ToastProvider />
            <div className="min-h-screen mt-24">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <ProfileHeader />
                    <AvatarSection />
                    <ProfileForm />
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
