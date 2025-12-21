import { Save } from "lucide-react";

const SaveButton = () => {
  return (
    <div className="flex justify-center">
      <button
        type="submit"
        className="flex items-center gap-2 px-12 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all"
      >
        <Save className="w-5 h-5" />
        Save Changes
      </button>
    </div>
  );
};

export default SaveButton;
