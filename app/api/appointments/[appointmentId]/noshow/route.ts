import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ appointmentId: string }> }
) {
    try {
        const token = request.headers.get("authorization");

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { appointmentId } = await context.params;
        const backendUrl = process.env.BACKEND_API_URL || "localhost:8080";

        const response = await fetch(
            `http://${backendUrl}/appointments/${appointmentId}/noshow`,
            {
                method: "PUT",
                headers: {
                    Authorization: token,
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to mark appointment as no-show" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error marking appointment as no-show:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
