import { User } from "lucide-react";
import { Message } from "./types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isPatient = message.sender === "patient";

  return (
    <div className={`flex ${isPatient ? "justify-end" : "justify-start"}`}>
      <div className="max-w-md">
        <div className="flex items-center gap-2 mb-2">
          {!isPatient && (
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-purple-600" />
            </div>
          )}
          <span className="text-sm text-gray-600">
            {message.name} • {message.time}
          </span>
        </div>

        <div
          className={`rounded-3xl px-6 py-3 ${
            isPatient
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white ml-auto"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}
