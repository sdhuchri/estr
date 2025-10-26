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
import { signIn } from "@/services/authService";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import { createPortal } from "react-dom";
// import { insertLogActivity } from "@/services/logActivity";

export default function SignInForm() {
  const toastRef = useRef<Toast>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn(userid, password);
      console.log("Logged in successfully:", result);

      if (result.message === "Success") {
        const cookieOptions = { path: "/estr" };

        Cookies.set("userId", result.data.userid, cookieOptions);
        Cookies.set("userDomain", result.data.userdomain, cookieOptions);
        Cookies.set("userName", result.data.userName, cookieOptions);
        Cookies.set("branchCode", result.data.branch.id, cookieOptions);
        Cookies.set("branchName", result.data.branch.name, cookieOptions);
        Cookies.set("userRole", result.data.role, cookieOptions);
        Cookies.set("userLevel", result.data.level, cookieOptions);
        Cookies.set("userDepartmen", result.data.departmen, cookieOptions);

        // Insert log activity
        // await insertLogActivity({
        //   user_id: result.data.userid,
        //   action: "Signin",
        //   url: window.location.href,
        //   kode_cabang: result.data.branch.id,
        //   nama_cabang: result.data.branch.name,
        //   keterangan: "Succes Login"
        // });

        router.push("/home/");
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: result.message,
          detail: result.detail,
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

      <div className="flex flex-col flex-1 lg:w-1/2 w-full relative min-h-screen p-6">
        <Toast ref={toastRef} />

        {/* Logo */}
        <Link
          href="/"
          className="absolute top-6 left-6 inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <Image
            width={250}
            height={100}
            src="/estr/images/logo/BCA_Syariah_logo.png"
            alt="BCA Syariah Logo"
          />
        </Link>

        {/* Login Form */}
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
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
