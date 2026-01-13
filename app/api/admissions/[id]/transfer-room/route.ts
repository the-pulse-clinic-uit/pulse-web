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
        const { searchParams } = new URL(request.url);
        const newRoomId = searchParams.get("newRoomId");

        if (!id) {
            return NextResponse.json(
                { error: "Admission ID is required" },
                { status: 400 }
            );
        }

        if (!newRoomId) {
            return NextResponse.json(
                { error: "New room ID is required" },
                { status: 400 }
            );
        }

        const backendUrl = process.env.BACKEND_API_URL || "localhost:8080";
        const response = await fetch(
            `http://${backendUrl}/admissions/${id}/transfer-room?newRoomId=${newRoomId}`,
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
                { error: data.message || "Failed to transfer room" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Transfer room error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
