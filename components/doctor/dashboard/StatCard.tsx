interface Props {
  title: string;
  value: string;
  trend?: string;
}

export default function StatCard({ title, value, trend }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span className="text-sm text-green-600">{trend} from last week</span>
        )}
      </div>
    </div>
  );
}
