import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ patientId: string }> }
) {
  try {
    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const response = await fetch(
      `${API_BASE_URL}/encounters/patient/${params.patientId}`,
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
        { message: error || "Failed to fetch encounters" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching encounters:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
