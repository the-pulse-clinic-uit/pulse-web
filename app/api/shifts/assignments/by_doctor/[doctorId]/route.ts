import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ doctorId: string }> }
) {
    try {
        const { doctorId } = await params;
        const token = req.headers.get("authorization");
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (!startDate || !endDate) {
            return NextResponse.json(
                { message: "startDate and endDate are required" },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${API_BASE_URL}/shifts/assignments/by_doctor/${doctorId}?startDate=${startDate}&endDate=${endDate}`,
            {
                method: "GET",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json(
                { message: error || "Failed to fetch doctor schedule" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching doctor schedule:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
