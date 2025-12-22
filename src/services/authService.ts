// src/services/authService.ts
import { MOCK_USERS, MOCK_USER_MENU, simulateDelay } from "@/data/mockData";

export const signIn = async (userid: string, password: string) => {
  try {
    // Simulate API delay
    await simulateDelay(800);

    // Find user in mock data
    const user = MOCK_USERS.find(
      (u) => u.userid === userid && u.password === password
    );

    if (!user) {
      return {
        message: "Failed",
        detail: "Invalid userid or password"
      };
    }

    // Return success response with user data
    return {
      message: "Success",
      data: {
        userid: user.userid,
        userdomain: user.userDomain,
        userName: user.userName,
        branch: user.branch,
        role: user.role,
        level: user.level,
        departmen: user.departmen,
        userSession: user.userSession
      },
      usermenu: MOCK_USER_MENU
    };
  } catch (error) {
    throw error;
  }
};

export const getUserMenu = async (userid: string) => {
  try {
    // Simulate API delay
    await simulateDelay(300);

    // Find user in mock data
    const user = MOCK_USERS.find((u) => u.userid === userid);

    if (!user) {
      return {
        message: "Failed",
        detail: "User not found"
      };
    }

    return {
      message: "Success",
      data: MOCK_USER_MENU
    };
  } catch (error) {
    throw error;
  }
};
