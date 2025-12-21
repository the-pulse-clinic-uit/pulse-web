import { ReactNode } from "react";

interface ProfileFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "textarea";
  rows?: number;
  placeholder?: string;
  icon?: ReactNode;
}

export default function ProfileField({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  rows = 1,
  placeholder,
  icon
}: ProfileFieldProps) {
  return (
    <div>
      <label className={`text-sm font-medium text-gray-700 mb-2 ${icon ? 'flex items-center gap-2' : 'block'}`}>
        {icon}
        {label}
      </label>
      {isEditing ? (
        type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )
      ) : (
        <p className="text-gray-900 leading-relaxed">{value}</p>
      )}
    </div>
  );
}