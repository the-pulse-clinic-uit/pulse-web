import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader) {
            return NextResponse.json(
                { error: "Authorization header is required" },
                { status: 401 }
            );
        }
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { error: "Admission ID is required" },
                { status: 400 }
            );
        }

        const backendUrl = process.env.BACKEND_API_URL || "localhost:8080";
        const response = await fetch(
            `http://${backendUrl}/admissions/${id}/discharge`,
            {
                method: "PUT",
                headers: {
                    Authorization: authHeader,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: data.message || "Failed to discharge patient" },
                { status: response.status }
            );
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Discharge patient error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
