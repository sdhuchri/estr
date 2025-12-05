// Client-side session utilities
export async function getSession() {
  try {
    const response = await fetch("/estr/api/auth/session", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export async function login(userid: string, password: string) {
  try {
    const response = await fetch("/estr/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userid, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await fetch("/estr/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Logout response not ok:", response.status);
    }

    const data = await response.json();
    console.log("Logout response:", data);
    return data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}
