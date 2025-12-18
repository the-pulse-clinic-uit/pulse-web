import { Phone, Video, Info } from "lucide-react";
import Image from "next/image";

export default function ChatHeader() {
    return (
        <div className="px-8 py-4 border-b border-base-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        <Image src="/images/patient-avatar.png" alt="Patient" width={48} height={48} />
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold">Patient 1</h3>
                    <p className="text-sm text-success">active now</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="btn btn-ghost btn-circle btn-sm">
                    <Phone className="w-5 h-5 text-primary" />
                </button>
                <button className="btn btn-ghost btn-circle btn-sm">
                    <Video className="w-5 h-5 text-primary" />
                </button>
                <button className="btn btn-ghost btn-circle btn-sm">
                    <Info className="w-5 h-5 text-primary" />
                </button>
            </div>
        </div>
    );
}
