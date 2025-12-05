import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function useSessionValidation(intervalSeconds = 30) {
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isValidatingRef = useRef(false);

  useEffect(() => {
    const validateSession = async () => {
      // Prevent multiple simultaneous validations
      if (isValidatingRef.current) return;

      isValidatingRef.current = true;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch("/estr/api/auth/validate", {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.log("Session validation failed, status:", response.status);

          // Only logout if it's a 401 (unauthorized)
          if (response.status === 401) {
            // Clear session storage
            sessionStorage.clear();

            // Show message
            sessionStorage.setItem("sessionInvalidated", "true");

            // Redirect to signin
            window.location.href = "/estr/signin";
          }
          return;
        }

        const data = await response.json();

        if (!data.valid) {
          console.log("Session invalid, logging out...");

          // Clear session storage
          sessionStorage.clear();

          // Show message
          sessionStorage.setItem("sessionInvalidated", "true");

          // Redirect to signin
          window.location.href = "/estr/signin";
        } else {
          console.log("Session valid");
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.error("Session validation timeout");
        } else {
          console.error("Session validation error:", error);
        }
        // Don't logout on network errors, just log
      } finally {
        isValidatingRef.current = false;
      }
    };

    // Start validation after 5 seconds delay (not immediately)
    const initialTimeout = setTimeout(() => {
      validateSession();

      // Then validate periodically
      intervalRef.current = setInterval(validateSession, intervalSeconds * 1000);
    }, 5000);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalSeconds, router]); // Removed isValidating from dependencies
}
