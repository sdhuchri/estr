// src/services/userMenu.ts

export const userMenu = async (userid: string) => {
  try {
    const response = await fetch("http://10.125.9.43/estr/usermenu", {
      method: "POST", // Assuming you're fetching reference data
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};