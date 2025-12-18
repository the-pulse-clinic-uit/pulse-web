import { Send, Paperclip, Check, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export default function ChatInput() {
    return (
        <div className="px-8 py-4 border-t border-base-300">
            <div className="flex items-center gap-3">
                <button className="btn btn-ghost btn-circle btn-sm">
                    <MoreHorizontal className="w-5 h-5" />
                </button>

                <div className="avatar">
                    <div className="w-8 rounded-full">
                        <Image src="/images/default-avatar.png" alt="Staff" width={32} height={32} />
                    </div>
                </div>

                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="input input-bordered w-full rounded-full"
                    />
                </div>

                <button className="btn btn-primary btn-circle">
                    <Send className="w-5 h-5" />
                </button>

                <button className="btn btn-ghost btn-circle btn-sm">
                    <Paperclip className="w-5 h-5" />
                </button>

                <button className="btn btn-ghost btn-circle btn-sm">
                    <Check className="w-5 h-5 text-success" />
                </button>
            </div>
        </div>
    );
}
