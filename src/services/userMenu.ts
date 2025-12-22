// src/services/userMenu.ts
import { MOCK_USER_MENU, simulateDelay } from "@/data/mockData";

export const userMenu = async (userid: string) => {
  try {
    // Simulate API delay
    await simulateDelay(300);

    return {
      status: "success",
      message: "Success",
      data: MOCK_USER_MENU
    };
  } catch (error) {
    throw error;
  }
};
