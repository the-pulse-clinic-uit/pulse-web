import { User } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="bg-white rounded-3xl shadow-lg mb-6 p-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center">
          <User className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-purple-900">Support Team</h2>
          <p className="text-green-600 text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full" />
            Online
          </p>
        </div>
      </div>
    </div>
  );
}
