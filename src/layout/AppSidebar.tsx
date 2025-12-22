"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { getUserMenu } from "../services/authService";
import { getSession } from "@/lib/session";
import NProgress from "nprogress";

import {
  ChevronDownIcon,
  HorizontaLDots,
} from "../icons/index";

import {
  CircleCheckBig,
  Grid,
  FileText,
  FileStack,
  UserCircle,
  List,
  SquarePlus,
  Files,
  BadgeCheck,
  Logs,
  CircleX,
  Landmark,
  Home,
  TimerReset,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    icon: React.ReactNode;
  }[];
};

// Icon mapping helper
const getIconByName = (name: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    "Manual Cabang": <FileText />,
    "List Reject": <CircleX />,
    "BI-Fast Transaction": <Landmark />,
    "Setting": <Logs />,
    "Setting Parameter": <CircleCheckBig />,
    "Laporan": <FileStack />,
    "Manual Kep": <BadgeCheck />,
    "Home" : <Home />,
    "Manual Job (UAT Only)": <TimerReset />,
  };

  return iconMap[name] || <FileText />;
};

const getSubIconByName = (name: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    "To Do List": <List />,
    "Tracking": <FileStack />,
    "Input Manual": <SquarePlus />,
    "Input": <SquarePlus />,
    "Edit": <FileText />,
    "Operator": <UserCircle />,
    "Operator Kepatuhan": <UserCircle />,
    "Supervisor Kepatuhan": <BadgeCheck />,
    "Aktif": <SquarePlus />,
    "Tidak Aktif": <FileText />,
    "Setting Parameter": <CircleCheckBig />,
    "Setting Kode Transaksi": <Files />,
    "Otorisasi": <BadgeCheck />,
    "Status": <CircleCheckBig />,
    "Laporan Aktivitas": <FileStack />,
  };

  return iconMap[name] || <FileText />;
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Start with false since we check cache first
  const [branchName, setBranchName] = useState<string>("");
  const [branchCode, setBranchCode] = useState<string>("");

  const isActive = useCallback(
    (path: string) => {
      // Exact match for the path
      if (pathname === path) return true;
      
      // Check if pathname starts with path and is followed by a slash
      // This ensures /setting-parameter/otorisasi doesn't match /setting-parameter/otorisasi-prioritas
      if (pathname.startsWith(path + '/')) {
        return true;
      }
      
      return false;
    },
    [pathname]
  );

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: "main", index };
    });
  };

  // Load menu data from localStorage (set during login)
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const session = await getSession();

        if (!session) {
          setIsLoading(false);
          return;
        }

        if (session.branchName) {
          setBranchName(session.branchName);
        }

        if (session.branchCode) {
          setBranchCode(session.branchCode);
        }

        if (!session.userId) {
          setIsLoading(false);
          return;
        }

        // Get menu from localStorage (saved during login)
        const userMenuString = localStorage.getItem("userMenu");
        
        if (!userMenuString) {
          setIsLoading(false);
          return;
        }

        const menuData = JSON.parse(userMenuString);

        // Transform menu data to NavItem format
        const transformedMenu: NavItem[] = menuData.map((item: any) => ({
          name: item.name,
          icon: getIconByName(item.name),
          path: item.path === "#" ? undefined : item.path,
          subItems: item.subItems?.map((subItem: any) => ({
            name: subItem.name,
            path: subItem.path,
            icon: getSubIconByName(subItem.name),
          })) || undefined,
        }));

        setNavItems(transformedMenu);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading menu from localStorage:", error);
        setIsLoading(false);
      }
    };

    loadMenuData();
  }, []);

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                }`}
            >
              <span
                className={`transition-colors duration-200 ${openSubmenu?.index === index
                  ? "text-gray-600 menu-item-icon-active"
                  : "text-white group-hover:text-gray-600 menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text transition-colors duration-200 ${openSubmenu?.index === index
                  ? "text-gray-600"
                  : "text-white group-hover:text-gray-600"
                  }`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-all duration-200 ${openSubmenu?.index === index
                    ? "rotate-180 text-gray-600"
                    : "text-white group-hover:text-gray-600"
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <button
                onClick={() => {
                  if (!nav.path) return;

                  if (pathname === nav.path) {
                    return;
                  }

                  NProgress.start();
                  router.push(nav.path);
                }}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`transition-colors duration-200 ${isActive(nav.path)
                    ? "text-gray-600 menu-item-icon-active"
                    : "text-white group-hover:text-gray-600 menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text transition-colors duration-200 ${isActive(nav.path)
                    ? "text-gray-600"
                    : "text-white group-hover:text-gray-600"
                    }`}>{nav.name}</span>
                )}
              </button>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`main-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <button
                      onClick={() => {
                        if (pathname === subItem.path) {
                          return;
                        }
                        NProgress.start();
                        router.push(subItem.path);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-md transition-colors duration-200 ${isActive(subItem.path)
                        ? "text-gray-600 menu-dropdown-item-active"
                        : "text-white hover:text-gray-600 menu-dropdown-item-inactive"
                        }`}
                    >
                      <span>{subItem.name}</span>
                      <span className="flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={`${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <aside
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 text-white transition-all duration-300 ease-in-out z-50 border-r border-slate-700/50 shadow-2xl
          ${isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
          }
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
        style={{ backgroundColor: '#161950', minHeight: '100vh', height: '100%' }}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`py-8 flex flex-col ${!isExpanded && !isHovered ? "lg:items-center" : "items-start"
            }`}
        >
          <Link href="/" className="flex items-center">
            {isExpanded || isHovered || isMobileOpen ? (
              <h1 className="text-2xl font-bold text-white">E-STR Demo</h1>
            ) : (
              <h1 className="text-xl font-bold text-white">E-STR</h1>
            )}
          </Link>
          {branchName && (isExpanded || isHovered || isMobileOpen) && (
            <div className="mt-3 px-2">
              <p className="text-xs text-gray-300 font-medium truncate">
                {branchName}{branchCode && ` - ${branchCode}`}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-white ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? "" : <HorizontaLDots />}
                </h2>
                {isLoading && navItems.length === 0 ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : navItems.length === 0 ? (
                  <div className="text-white text-sm px-2">No menu items available</div>
                ) : (
                  <>
                    {renderMenuItems(navItems)}
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
