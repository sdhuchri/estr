"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/session";
import { Toast } from "primereact/toast";
import { createPortal } from "react-dom";
// import { insertLogActivity } from "@/services/logActivity";

export default function SignInForm() {
  const toastRef = useRef<Toast>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Clear form when component mounts after logout
  React.useEffect(() => {
    const justLoggedOut = sessionStorage.getItem("justLoggedOut");
    const sessionInvalidated = sessionStorage.getItem("sessionInvalidated");
    
    if (justLoggedOut === "true") {
      // Clear the form fields
      setUserid("");
      setPassword("");

      // Clear the flag
      sessionStorage.removeItem("justLoggedOut");

      // Reset the form element
      if (formRef.current) {
        formRef.current.reset();
      }
    }

    if (sessionInvalidated === "true") {
      // Show message that session was invalidated
      toastRef.current?.show({
        severity: "warn",
        summary: "Session Terminated",
        detail: "Your session has been terminated because another user logged in with the same account.",
        life: 5000,
      });

      // Clear the flag
      sessionStorage.removeItem("sessionInvalidated");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login(userid, password);

      if (result.success) {
        // Store menu in localStorage (too large for cookies)
        if (result.userMenu) {
          localStorage.setItem("userMenu", JSON.stringify(result.userMenu));
        }
        // Insert log activity
        // await insertLogActivity({
        //   user_id: userid,
        //   action: "Signin",
        //   url: window.location.href,
        //   kode_cabang: "",
        //   nama_cabang: "",
        //   keterangan: "Success Login"
        // });

        // Redirect immediately after successful login
        router.push("/home");
        router.refresh(); // Refresh to update server components
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: result.message || "Login Failed",
          detail: result.detail || "Invalid credentials",
          life: 3000,
        });

        // Insert log activity
        // await insertLogActivity({
        //   user_id: userid,
        //   action: "Signin",
        //   url: window.location.href,
        //   kode_cabang: "",
        //   nama_cabang: "",
        //   keterangan: "Failed Login"
        // });
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Login failed";
      setError(errorMessage);

      toastRef.current?.show({
        severity: "error",
        summary: "Login Failed",
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>,
          document.body
        )}

      <div className="flex flex-col lg:w-1/2 w-full relative h-full overflow-y-auto p-6 bg-white dark:bg-gray-900">
        <Toast ref={toastRef} />

        {/* Logo */}
        <Link
          href="/"
          className="absolute top-6 left-6 inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Logo
          </div>
        </Link>

        {/* Login Form */}
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your userid and password to sign in!
              </p>
            </div>

            <div>
              <Label>
                Userid <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="Userid"
                type="text"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                autoComplete="off"
                name="userid"
              />
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  name="password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <div>
              <Button className="w-full" size="sm" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
              Version 4.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
