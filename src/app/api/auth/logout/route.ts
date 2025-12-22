import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Delete all auth cookies with explicit options
    const cookieNames = [
      "userId",
      "userDomain",
      "userName",
      "branchCode",
      "branchName",
      "userRole",
      "userLevel",
      "userDepartmen",
      "userProfile",
      "userMenu",
      "userSession",
      "userId_client", // Add client-side userId cookie
    ];

    // Set cookies to empty with past expiry date
    cookieNames.forEach((name) => {
      response.cookies.set(name, "", {
        httpOnly: name !== "userId_client", // userId_client is not httpOnly
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0), // Set to epoch time (past date)
      });
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
      },
      { status: 500 }
    );
  }
}
