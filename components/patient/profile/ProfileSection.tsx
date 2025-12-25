import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

const ProfileSection = ({ title, children }: Props) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
      <h2 className="text-purple-900 mb-6">{title}</h2>
      <div className="grid md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
};

export default ProfileSection;
