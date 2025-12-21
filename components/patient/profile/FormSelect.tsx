interface Props {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FormSelect = ({ label, name, value, options, onChange }: Props) => {
  return (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-6 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-purple-400"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
