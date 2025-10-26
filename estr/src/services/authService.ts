// src/services/authService.ts
export const signIn = async (userid: string, password: string) => {
  try {
    const response = await fetch("http://10.125.9.43/new_estr/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
