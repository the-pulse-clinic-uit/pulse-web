import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader) {
            return NextResponse.json(
                { error: "Authorization header is required" },
                { status: 401 }
            );
        }

        const backendUrl = process.env.BACKEND_API_URL || "localhost:8080";
        const response = await fetch(
            `http://${backendUrl}/encounters/eligible-for-admission`,
            {
                method: "GET",
                headers: {
                    Authorization: authHeader,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                {
                    error:
                        data.message ||
                        "Failed to fetch encounters eligible for admission",
                },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Get encounters eligible for admission error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
