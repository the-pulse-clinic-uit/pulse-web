import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Cookies from "js-cookie";

export interface ChatMessage {
    senderId: string;
    senderName: string;
    senderRole: "PATIENT" | "STAFF" | "DOCTOR";
    recipientId?: string;
    content?: string;
    type:
        | "CHAT"
        | "PATIENT_CONNECTED"
        | "PATIENT_DISCONNECTED"
        | "STAFF_AVAILABLE"
        | "STAFF_UNAVAILABLE"
        | "TYPING";
    timestamp?: string;
}

export class WebSocketService {
    private client: Client | null = null;
    private connected: boolean = false;
    private messageCallbacks: ((message: ChatMessage) => void)[] = [];
    private typingCallbacks: ((message: ChatMessage) => void)[] = [];
    private statusCallbacks: ((connected: boolean) => void)[] = [];
    private notificationCallbacks: ((message: ChatMessage) => void)[] = [];
    private mockMode: boolean = false;

    connect(
        userId: string,
        userName: string,
        role: "PATIENT" | "STAFF" | "DOCTOR"
    ) {
        const token = Cookies.get("token");
        if (!token) {
            this.enableMockMode();
            return;
        }

        if (this.connected && this.client) {
            this.statusCallbacks.forEach((cb) => cb(true));
            return;
        }

        try {
            this.client = new Client({
                webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                debug: (str) => {
                    console.log("STOMP:", str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    this.connected = true;
                    this.mockMode = false;
                    this.statusCallbacks.forEach((cb) => cb(true));

                    this.client?.subscribe(
                        "/user/queue/messages",
                        (message) => {
                            const chatMessage: ChatMessage = JSON.parse(
                                message.body
                            );
                            this.messageCallbacks.forEach((cb) =>
                                cb(chatMessage)
                            );
                        }
                    );

                    this.client?.subscribe("/user/queue/typing", (message) => {
                        const typingMessage: ChatMessage = JSON.parse(
                            message.body
                        );
                        this.typingCallbacks.forEach((cb) => cb(typingMessage));
                    });

                    if (role === "STAFF" || role === "DOCTOR") {
                        this.client?.subscribe("/topic/staff", (message) => {
                            const notification: ChatMessage = JSON.parse(
                                message.body
                            );
                            this.notificationCallbacks.forEach((cb) =>
                                cb(notification)
                            );
                        });
                    }
                },
                onStompError: (frame) => {
                    this.connected = false;
                    this.statusCallbacks.forEach((cb) => cb(false));
                },
                onWebSocketError: (event) => {
                    this.enableMockMode();
                },
            });

            this.client.activate();

            setTimeout(() => {
                if (!this.connected) {
                    this.enableMockMode();
                }
            }, 5000);
        } catch (error) {
            this.enableMockMode();
        }
    }

    private enableMockMode() {
        if (this.mockMode) return;
        this.mockMode = true;
        this.connected = true;
        this.statusCallbacks.forEach((cb) => cb(true));
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.connected = false;
            this.statusCallbacks.forEach((cb) => cb(false));
        }
    }

    sendMessage(
        recipientId: string,
        content: string,
        senderId: string,
        senderName: string,
        senderRole: "PATIENT" | "STAFF" | "DOCTOR"
    ) {
        if (!this.client || !this.connected) {
            console.error("WebSocket not connected");
            return;
        }

        const message: ChatMessage = {
            senderId,
            senderName,
            senderRole,
            recipientId,
            content,
            type: "CHAT",
        };

        this.client.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(message),
        });
    }

    requestStaff(senderId: string, senderName: string) {
        if (!this.client || !this.connected) {
            console.error("WebSocket not connected");
            return;
        }

        const message: ChatMessage = {
            senderId,
            senderName,
            senderRole: "PATIENT",
            type: "PATIENT_CONNECTED",
        };

        this.client.publish({
            destination: "/app/chat.requestStaff",
            body: JSON.stringify(message),
        });
    }

    endSession(senderId: string) {
        if (!this.client || !this.connected) {
            console.error("WebSocket not connected");
            return;
        }

        const message: ChatMessage = {
            senderId,
            senderName: "",
            senderRole: "PATIENT",
            type: "PATIENT_DISCONNECTED",
        };

        this.client.publish({
            destination: "/app/chat.endSession",
            body: JSON.stringify(message),
        });
    }

    setStaffAvailable(senderId: string, senderName: string) {
        if (!this.client || !this.connected) {
            console.error("WebSocket not connected");
            return;
        }

        const message: ChatMessage = {
            senderId,
            senderName,
            senderRole: "STAFF",
            type: "STAFF_AVAILABLE",
        };

        this.client.publish({
            destination: "/app/staff.setAvailable",
            body: JSON.stringify(message),
        });
    }

    setStaffUnavailable(senderId: string, senderName: string) {
        if (!this.client || !this.connected) {
            console.error("WebSocket not connected");
            return;
        }

        const message: ChatMessage = {
            senderId,
            senderName,
            senderRole: "STAFF",
            type: "STAFF_UNAVAILABLE",
        };

        this.client.publish({
            destination: "/app/staff.setUnavailable",
            body: JSON.stringify(message),
        });
    }

    sendTypingIndicator(
        recipientId: string,
        senderId: string,
        senderName: string,
        senderRole: "PATIENT" | "STAFF" | "DOCTOR"
    ) {
        if (!this.client || !this.connected) return;

        const message: ChatMessage = {
            senderId,
            senderName,
            senderRole,
            recipientId,
            type: "TYPING",
        };

        this.client.publish({
            destination: "/app/chat.typing",
            body: JSON.stringify(message),
        });
    }

    onMessage(callback: (message: ChatMessage) => void) {
        this.messageCallbacks.push(callback);
    }

    onTyping(callback: (message: ChatMessage) => void) {
        this.typingCallbacks.push(callback);
    }

    onStatusChange(callback: (connected: boolean) => void) {
        this.statusCallbacks.push(callback);
    }

    onNotification(callback: (message: ChatMessage) => void) {
        this.notificationCallbacks.push(callback);
    }

    isConnected() {
        return this.connected;
    }
}

export const websocketService = new WebSocketService();
