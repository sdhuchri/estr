import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

let isRedirecting = false; // Global flag to prevent multiple redirects

export function useSessionValidationOnNav() {
  const pathname = usePathname();
  const isValidatingRef = useRef(false);

  useEffect(() => {
    // Skip validation if already redirecting or on signin page
    if (isRedirecting || pathname === "/signin") {
      return;
    }

    const validateSession = async () => {
      // Prevent multiple simultaneous validations
      if (isValidatingRef.current) return;
      
      isValidatingRef.current = true;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("/api/auth/validate", {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok && response.status === 401) {
          console.log("Session invalid (401), logging out...");
          handleLogout();
          return;
        }

        const data = await response.json();

        if (!data.valid) {
          console.log("Session invalid, logging out...");
          handleLogout();
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.error("Session validation timeout");
        } else {
          console.error("Session validation error:", error);
        }
        // Don't logout on network errors
      } finally {
        isValidatingRef.current = false;
      }
    };

    const handleLogout = () => {
      if (isRedirecting) return; // Prevent multiple redirects
      
      isRedirecting = true;
      
      // Clear session storage
      sessionStorage.clear();
      
      // Show message
      sessionStorage.setItem("sessionInvalidated", "true");
      
      // Redirect to signin
      window.location.href = "/signin";
    };

    // Validate session on route change
    validateSession();
  }, [pathname]);
}
