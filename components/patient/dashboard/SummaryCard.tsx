import Link from "next/link";

interface Props {
  icon: React.ReactNode;
  badge: string;
  badgeColor: "purple" | "green" | "orange";
  title: string;
  main: string;
  sub: string;
  href: string;
}

const badgeColorMap = {
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
};

export default function SummaryCard({
  icon,
  badge,
  badgeColor,
  title,
  main,
  sub,
  href,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${badgeColorMap[badgeColor]}`}
        >
          {badge}
        </span>
      </div>

      <h3 className="text-purple-900 mb-1 font-medium text-sm">{title}</h3>
      <p className="text-gray-700 mb-0.5 text-sm">{main}</p>
      <p className="text-gray-600 text-xs mb-3">{sub}</p>

      <Link href={href} className="text-purple-600 hover:text-purple-700 text-xs">
        View details →
      </Link>
    </div>
  );
}
