"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: 'ease',
  speed: 500
});

export default function TopLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    // Start progress on route change
    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    // Listen to Next.js route changes
    window.addEventListener("beforeunload", handleStart);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      handleComplete();
    };
  }, []);

  return null;
}
