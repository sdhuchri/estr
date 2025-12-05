// src/services/authService.ts
export const signIn = async (userid: string, password: string) => {
  try {
    const response = await fetch("http://10.125.22.11:8080/api/auth/login", {
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


export const getUserMenu = async (userid: string) => {
  try {
    const response = await fetch("http://10.125.22.11:8080/api/auth/usermenu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed get user menu");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
