import { NextRequest, NextResponse } from "next/server";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, history } = body;

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const token = request.headers.get("authorization");

        const backendUrl = process.env.BACKEND_API_URL || "localhost:8080";

        const requestBody: { message: string; history?: Message[] } = {
            message,
        };

        if (history && Array.isArray(history)) {
            requestBody.history = history;
        }

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = token;
        }

        const response = await fetch(`http://${backendUrl}/ai/chat`, {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to get AI response" },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("AI chat error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
