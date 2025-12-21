interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const FormTextArea = ({ label, name, value, onChange }: Props) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-gray-700 mb-2">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full px-6 py-3 rounded-3xl border border-gray-200 focus:ring-2 focus:ring-purple-400"
      />
    </div>
  );
};

export default FormTextArea;
