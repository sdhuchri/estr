import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const userId = cookieStore.get("userId")?.value;
    const userSession = cookieStore.get("userSession")?.value;

    if (!userId || !userSession) {
      return NextResponse.json(
        {
          valid: false,
          message: "No session found",
        },
        { status: 401 }
      );
    }

    // Mock validation - always return valid for demo
    // In production, this would validate against backend
    return NextResponse.json({
      valid: true,
      message: "Session is valid",
    });

  } catch (error: any) {
    console.error("Session validation error:", error);
    return NextResponse.json(
      {
        valid: false,
        message: "Validation failed",
      },
      { status: 500 }
    );
  }
}
