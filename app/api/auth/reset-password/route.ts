import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, otp, newPassword } = body;

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { error: "Email, OTP, and new password are required" },
                { status: 400 }
            );
        }

        const backendUrl = process.env.BACKEND_API_URL || "localhost:8080";
        const response = await fetch(`http://${backendUrl}/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to reset password" },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
