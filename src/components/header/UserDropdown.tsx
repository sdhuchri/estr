"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useRouter, usePathname } from "next/navigation";
import { getProfileLabel } from "@/utils/profileMapper";
import { getSession, logout as logoutSession } from "@/lib/session";
import NProgress from "nprogress";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [firstLetter, setFirstLetter] = useState("?");
  const [userId, setUserId] = useState("?");
  const [userName, setUserName] = useState("?");
  const [userDomain, setUserDomain] = useState("");
  const [userProfile, setUserProfile] = useState("?");
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const session = await getSession();

      // If no session, user is not logged in
      if (!session) {
        return;
      }

      const userData = {
        userId: session.userId,
        userName: session.userName || "?",
        userDomain: session.userDomain || "",
        userProfile: session.userProfile ? getProfileLabel(session.userProfile) : (session.userName || "User")
      };

      // Cache user data
      const cacheKey = 'user_data';
      sessionStorage.setItem(cacheKey, JSON.stringify(userData));

      setUserId(userData.userId);
      setUserName(userData.userName);
      setUserDomain(userData.userDomain);
      setUserProfile(userData.userProfile);
      setFirstLetter(userData.userName.charAt(0).toUpperCase());
      
      // Show Change Password only if userDomain is empty (local account)
      setShowChangePassword(userData.userDomain === "" || userData.userDomain.trim() === "");
    };

    // Load immediately
    loadUserData();

    // Cleanup function
    return () => {
      setIsLoggingOut(false);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Call logout API to clear HttpOnly cookies
      await logoutSession();

      // Set flag to clear form on signin page
      sessionStorage.setItem("justLoggedOut", "true");

      // Clear cached data
      sessionStorage.removeItem("user_data");
      sessionStorage.removeItem("auth_status");

      // Clear menu from localStorage
      localStorage.removeItem("userMenu");

      // Clear menu cache
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith("menu_")) {
          sessionStorage.removeItem(key);
        }
      });

      // Clear browser password cache by submitting a dummy form with random values
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

      // Submit and remove the form
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      }, 100);

      // Force hard reload to clear all state
      window.location.href = "/estr/signin";
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      // Still redirect even if logout API fails
      window.location.href = "/estr/signin";
    }
  };

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <>
      {isLoggingOut &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>,
          document.body
        )}

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
        >
          <span
            className="mr-3 overflow-hidden rounded-full h-11 w-11 flex items-center justify-center text-white font-semibold text-lg"
            style={{ backgroundColor: "#161950" }}
          >
            {firstLetter}
          </span>

          <div className="flex flex-col items-start mr-1">
            <span className="block font-medium text-theme-sm">{userName}</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">{userProfile}</span>
          </div>

          <svg
            className={`ml-1 stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <Dropdown
          isOpen={isOpen}
          onClose={closeDropdown}
          className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
        >
          {showChangePassword && (
            <button
              onClick={() => {
                closeDropdown();
                if (pathname === "/change-password") {
                  return;
                }
                NProgress.start();
                router.push("/change-password");
              }}
              className="flex items-center gap-3 px-3 py-2 font-medium rounded-lg group text-theme-sm text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.25 10.5C7.25 7.87665 9.37665 5.75 12 5.75C14.6234 5.75 16.75 7.87665 16.75 10.5V11.25H17.5C18.9069 11.25 20.25 12.5931 20.25 14V18C20.25 19.4069 18.9069 20.75 17.5 20.75H6.5C5.09315 20.75 3.75 19.4069 3.75 18V14C3.75 12.5931 5.09315 11.25 6.5 11.25H7.25V10.5ZM8.75 11.25H15.25V10.5C15.25 8.70507 13.7949 7.25 12 7.25C10.2051 7.25 8.75 8.70507 8.75 10.5V11.25ZM6.5 12.75C5.92157 12.75 5.25 13.4216 5.25 14V18C5.25 18.5784 5.92157 19.25 6.5 19.25H17.5C18.0784 19.25 18.75 18.5784 18.75 18V14C18.75 13.4216 18.0784 12.75 17.5 12.75H6.5Z"
                  fill=""
                />
              </svg>
              Change Password
            </button>
          )}

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-3 px-3 py-2 ${showChangePassword ? 'mt-1' : ''} font-medium rounded-lg group text-theme-sm
              ${isLoggingOut
                ? "cursor-not-allowed opacity-60"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              }`}
          >
            <svg
              className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                fill=""
              />
            </svg>
            Sign out
          </button>
        </Dropdown>
      </div>
    </>
  );
}
