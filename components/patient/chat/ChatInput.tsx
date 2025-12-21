import { Send, Paperclip } from "lucide-react";
import { FormEvent } from "react";

interface Props {
  message: string;
  setMessage: (value: string) => void;
  onSend: (e: FormEvent) => void;
}

export default function ChatInput({ message, setMessage, onSend }: Props) {
  return (
    <div className="border-t border-gray-200 p-6">
      <form onSubmit={onSend} className="flex items-center gap-4">
        <button
          type="button"
          className="p-3 text-gray-400 hover:text-purple-600"
        >
          <Paperclip className="w-6 h-6" />
        </button>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-6 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-purple-400"
        />

        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-3 rounded-full ${
            message.trim()
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}
