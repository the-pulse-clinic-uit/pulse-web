import { NextRequest, NextResponse } from "next/server";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, history } = body;

        console.log("[/api/ai/chat] Received request");

        if (!message || typeof message !== "string") {
            console.error("[/api/ai/chat] Invalid message");
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const token = request.headers.get("authorization");
        console.log("[/api/ai/chat] Token exists:", !!token);

        const backendUrl =
            process.env.BACKEND_API_URL || "http://localhost:8080";
        // Ensure URL starts with http:// or https://
        const apiUrl = backendUrl.startsWith("http")
            ? backendUrl
            : `http://${backendUrl}`;

        const fullUrl = `${apiUrl}/ai/chat`;
        console.log("[/api/ai/chat] Fetching from:", fullUrl);

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

        const response = await fetch(fullUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
        });

        console.log("[/api/ai/chat] Backend response status:", response.status);

        const data = await response.json();
        console.log(
            "[/api/ai/chat] Backend response data:",
            JSON.stringify(data).substring(0, 200)
        );

        if (!response.ok) {
            console.error("[/api/ai/chat] Backend error:", data);

            let errorMessage = "Failed to get AI response";
            if (data.message) {
                errorMessage = data.message;
            }
            if (data.data?.exception) {
                errorMessage = `${errorMessage} (${data.data.exception})`;
            }

            return NextResponse.json(
                {
                    error: errorMessage,
                    details: data,
                },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("[/api/ai/chat] Error:", error);
        console.error(
            "[/api/ai/chat] Error stack:",
            error instanceof Error ? error.stack : "No stack trace"
        );
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
