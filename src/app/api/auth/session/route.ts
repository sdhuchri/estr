import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    // Get all session data (menu is stored in localStorage, not cookies)
    const sessionData = {
      userId,
      userDomain: cookieStore.get("userDomain")?.value || "",
      userName: cookieStore.get("userName")?.value || "",
      branchCode: cookieStore.get("branchCode")?.value || "",
      branchName: cookieStore.get("branchName")?.value || "",
      userRole: cookieStore.get("userRole")?.value || "",
      userLevel: cookieStore.get("userLevel")?.value || "",
      userDepartmen: cookieStore.get("userDepartmen")?.value || "",
      userProfile: cookieStore.get("userProfile")?.value || "",
      userSession: cookieStore.get("userSession")?.value || "",
    };

    return NextResponse.json({
      success: true,
      data: sessionData,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get session",
      },
      { status: 500 }
    );
  }
}
