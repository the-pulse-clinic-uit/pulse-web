interface Props {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
}

export default function ActivityItem({ icon, title, desc, time }: Props) {
  return (
    <div className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-none">
      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-gray-900 text-sm">{title}</p>
        <p className="text-gray-600 text-xs">{desc}</p>
      </div>
      <span className="text-gray-500 text-xs">{time}</span>
    </div>
  );
}
