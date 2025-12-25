interface Props {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({ label, name, value, type = "text", onChange }: Props) => {
  return (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-6 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-purple-400"
      />
    </div>
  );
};

export default FormInput;
