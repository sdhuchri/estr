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

    // Validate session with backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://10.125.22.11:8080";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(`${backendUrl}/api/auth/validate-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid: userId,
        userSession: userSession,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error("Backend validation failed:", response.status);
      return NextResponse.json(
        {
          valid: false,
          message: "Backend validation failed",
        },
        { status: 401 }
      );
    }

    const result = await response.json();

    // Check if session is valid based on backend response
    if (result.status === "success") {
      return NextResponse.json({
        valid: true,
        message: result.message || "Session is valid",
      });
    } else {
      // Session invalid or expired
      return NextResponse.json(
        {
          valid: false,
          message: result.message || "Session tidak valid atau sudah kadaluarsa",
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("Backend validation timeout");
      return NextResponse.json(
        {
          valid: false,
          message: "Validation timeout",
        },
        { status: 408 }
      );
    }

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
