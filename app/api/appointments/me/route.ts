import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader) {
            console.error("[/api/appointments/me] No authorization header");
            return NextResponse.json(
                { error: "Authorization header is required" },
                { status: 401 }
            );
        }

        const backendUrl =
            process.env.BACKEND_API_URL || "http://localhost:8080";
        const apiUrl = backendUrl.startsWith("http")
            ? backendUrl
            : `http://${backendUrl}`;

        const fullUrl = `${apiUrl}/appointments/me`;
        console.log("[/api/appointments/me] Fetching from:", fullUrl);
        console.log(
            "[/api/appointments/me] Auth header:",
            authHeader.substring(0, 20) + "..."
        );

        const response = await fetch(fullUrl, {
            method: "GET",
            headers: {
                Authorization: authHeader,
                "Content-Type": "application/json",
            },
        });

        console.log(
            "[/api/appointments/me] Backend response status:",
            response.status
        );

        const data = await response.json();
        console.log(
            "[/api/appointments/me] Backend response data:",
            JSON.stringify(data).substring(0, 200)
        );

        if (!response.ok) {
            console.error("[/api/appointments/me] Backend error:", data);
            return NextResponse.json(
                { error: data.message || "Failed to fetch appointments" },
                { status: response.status }
            );
        }

        // Handle empty array
        if (Array.isArray(data) && data.length === 0) {
            console.log(
                "[/api/appointments/me] No appointments found, returning empty array"
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("[/api/appointments/me] Error:", error);
        console.error(
            "[/api/appointments/me] Error stack:",
            error instanceof Error ? error.stack : "No stack trace"
        );
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
