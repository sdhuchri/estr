import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/services/authService";

export async function POST(request: NextRequest) {
  try {
    const { userid, password } = await request.json();

    // Call existing auth service
    const result = await signIn(userid, password);

    if (result.message === "Success" && result.data) {
      // Prepare session data
      const sessionData = {
        userId: result.data.userid,
        userDomain: result.data.userdomain,
        userName: result.data.userName,
        branchCode: result.data.branch.id,
        branchName: result.data.branch.name,
        userRole: result.data.role,
        userLevel: result.data.level,
        userDepartmen: result.data.departmen,
        userProfile: result.usermenu?.[0]?.Profile || result.data.role || "User",
        userMenu: result.usermenu || [],
        userSession: result.data.userSession, // Session ID from backend
      };

      console.log("Session data userMenu:", sessionData.userMenu);

      // Create response with menu data
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        userMenu: sessionData.userMenu, // Send menu in response body
      });

      // Set HttpOnly cookies for each field
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 8, // 8 hours
      };

      response.cookies.set("userId", sessionData.userId, cookieOptions);
      response.cookies.set("userDomain", sessionData.userDomain, cookieOptions);
      response.cookies.set("userName", sessionData.userName, cookieOptions);
      response.cookies.set("branchCode", sessionData.branchCode, cookieOptions);
      response.cookies.set("branchName", sessionData.branchName, cookieOptions);
      response.cookies.set("userRole", sessionData.userRole, cookieOptions);
      response.cookies.set("userLevel", sessionData.userLevel, cookieOptions);
      response.cookies.set("userDepartmen", sessionData.userDepartmen, cookieOptions);
      response.cookies.set("userProfile", sessionData.userProfile, cookieOptions);
      // Don't store menu in cookie - too large, will be stored in localStorage
      response.cookies.set("userSession", sessionData.userSession, cookieOptions);
      
      // Set non-httpOnly userId cookie for client-side JavaScript access (for WebSocket, etc)
      response.cookies.set("userId_client", sessionData.userId, {
        httpOnly: false, // Allow JavaScript access
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/", // Same path as other cookies
        maxAge: 60 * 60 * 8, // 8 hours
      });

      return response;
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Login failed",
          detail: result.detail || "Invalid credentials",
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
        detail: error?.message || "An error occurred",
      },
      { status: 500 }
    );
  }
}
