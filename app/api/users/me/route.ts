import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization");

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const backendUrl = process.env.BACKEND_API_URL || "localhost:8080";

        const response = await fetch(`http://${backendUrl}/users/me`, {
            headers: {
                Authorization: token,
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch user data" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
