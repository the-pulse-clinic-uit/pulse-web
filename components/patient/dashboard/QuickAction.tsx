import Link from "next/link";

interface Props {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export default function QuickAction({ href, icon, title, desc }: Props) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all group"
    >
      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-purple-900 mb-1 font-medium text-sm">{title}</h4>
      <p className="text-gray-600 text-xs">{desc}</p>
    </Link>
  );
}
