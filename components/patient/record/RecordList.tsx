import { FileText } from "lucide-react";
import RecordItem, { Record } from "./RecordItem";

interface RecordListProps {
  records: Record[];
}

export default function RecordList({ records }: RecordListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No medical records found
        </h3>
        <p className="text-gray-600">
          Your medical records will appear here once they are available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {records.map((record) => (
        <RecordItem key={record.id} record={record} />
      ))}
    </div>
  );
}
