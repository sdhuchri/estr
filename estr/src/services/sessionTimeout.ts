// services/sessionTimeout.ts
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useInactivityLogout(timeoutMinutes = 10, onLogout?: () => void) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    Cookies.remove("userId", { path: "/estr" });
    Cookies.remove("userName", { path: "/estr" });
    Cookies.remove("userDomain", { path: "/estr" });
    Cookies.remove("branchCode", { path: "/estr" });
    Cookies.remove("branchName", { path: "/estr" });
    Cookies.remove("userRole", { path: "/estr" });
    Cookies.remove("userLevel", { path: "/estr" });
    Cookies.remove("userDepartmen", { path: "/estr" });

    if (onLogout) {
      onLogout(); // show toast
    }

    setTimeout(() => {
      router.push("/signin");
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
