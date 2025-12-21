import { FileText, Download, Eye, Calendar } from "lucide-react";

export interface Record {
  id: number;
  title: string;
  date: string;
  doctor: string;
  type: string;
  status: string;
}

interface RecordItemProps {
  record: Record;
}

export default function RecordItem({ record }: RecordItemProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {record.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {record.date}
              </span>
              <span>Dr: {record.doctor}</span>
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {record.type}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              record.status === "Normal" || record.status === "Complete"
                ? "bg-green-100 text-green-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {record.status}
          </span>
          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
