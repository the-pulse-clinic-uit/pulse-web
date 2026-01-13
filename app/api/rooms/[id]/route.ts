import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
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
                { error: "Room ID is required" },
                { status: 400 }
            );
        }

        const backendUrl = process.env.BACKEND_API_URL || "localhost:8080";
        const response = await fetch(`http://${backendUrl}/rooms/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: authHeader,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: data.message || "Failed to delete room" },
                { status: response.status }
            );
        }

        // Handle 204 No Content response
        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Delete room error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
