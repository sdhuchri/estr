// services/sessionTimeout.ts
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { logout as logoutSession } from "@/lib/session";

export function useInactivityLogout(timeoutMinutes = 10, onLogout?: () => void) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = async () => {
    try {
      // Call logout API to clear HttpOnly cookies
      await logoutSession();
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Set flag to clear form on signin page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("justLoggedOut", "true");

      // Clear cached data
      sessionStorage.removeItem("user_data");
      sessionStorage.removeItem("auth_status");
      
      // Clear all menu cache
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith("menu_")) {
          sessionStorage.removeItem(key);
        }
      });

      // Clear browser password cache with random values
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/signin";
      form.style.display = "none";

      const usernameInput = document.createElement("input");
      usernameInput.type = "text";
      usernameInput.name = "userid";
      usernameInput.value = "logged_out_" + Date.now();
      usernameInput.autocomplete = "username";

      const passwordInput = document.createElement("input");
      passwordInput.type = "password";
      passwordInput.name = "password";
      passwordInput.value = "logged_out_" + Date.now();
      passwordInput.autocomplete = "current-password";

      form.appendChild(usernameInput);
      form.appendChild(passwordInput);
      document.body.appendChild(form);

      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      }, 100);
    }

    if (onLogout) {
      onLogout(); // show toast
    }

    setTimeout(() => {
      // Force hard reload to clear all state
      window.location.href = "/estr/signin";
    }, 1000); // beri waktu toast tampil
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(logout, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, []);
}
