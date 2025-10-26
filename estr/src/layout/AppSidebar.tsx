"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";



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
  LayoutGrid,
  SquarePlus,
  Files,
  BadgeCheck,
  Logs,
  Flag,
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



// Hardcoded menu data
const hardcodedMenuItems: NavItem[] = [
  {
    name: "Manual Cabang",
    icon: <FileText />,
    subItems: [
      {
        name: "Input",
        path: "/manual-cabang/input",
        icon: <SquarePlus />,
      },
      {
        name: "Edit",
        path: "/manual-cabang/edit",
        icon: <FileText />,
      },
    ],
  },
  {
    name: "Manual Kep",
    icon: <BadgeCheck />,
    subItems: [
      {
        name: "Operator Kepatuhan",
        path: "/manual-kep/operator",
        icon: <UserCircle />,
      },
      {
        name: "Supervisor Kepatuhan",
        path: "/manual-kep/supervisor",
        icon: <BadgeCheck />,
      },
    ],
  },
  {
    name: "List Reject",
    icon: <FileText />,
    subItems: [
      {
        name: "Aktif",
        path: "/list-reject/aktif",
        icon: <SquarePlus />,
      },
      {
        name: "Tidak Aktif",
        path: "/list-reject/tidak-aktif",
        icon: <FileText />,
      },
    ],
  },
  {
    name: "Setting",
    icon: <Logs />,
    subItems: [
      {
        name: "Setting Parameter",
        path: "/setting/setting-parameter",
        icon: <Logs />,
      },
      {
        name: "Setting Kode Transaksi",
        path: "/setting/setting-kode-transaksi",
        icon: <Files />,
      },
      {
        name: "Otorisasi",
        path: "/setting/otorisasi",
        icon: <BadgeCheck />,
      },
    ],
  },
  {
    name: "Laporan",
    icon: <FileStack />,
    path: "/laporan",
  },
  {
    name: "BI-Fast Transaction",
    icon: <Grid />,
    subItems: [
      {
        name: "To Do List",
        path: "/bi-fast/todo",
        icon: <List />,
      },
      {
        name: "Status",
        path: "/bi-fast/status",
        icon: <CircleCheckBig />,
      },
      {
        name: "Laporan Aktivitas",
        path: "/bi-fast/laporan-aktivitas",
        icon: <FileStack />,
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const [menuLoading, setMenuLoading] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navItems = hardcodedMenuItems;

  const isActive = useCallback(
    (path: string) => pathname.startsWith(path),
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

  useEffect(() => {
    setMenuLoading(false);
  }, [pathname]);

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
                    setMenuLoading(false);
                    return;
                  }

                  setMenuLoading(true);
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
                          setMenuLoading(false);
                          return;
                        }
                        setMenuLoading(true);
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
      {menuLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <aside
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-slate-700/50 shadow-2xl
          ${isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
          }
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
        style={{ backgroundColor: '#161950' }}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
        >
          <Link href="/">
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <Image
                  className="dark:hidden"
                  src="/estr/images/logo/bcas-logo.png"
                  alt="Logo"
                  width={230}
                  height={40}
                />
                <Image
                  className="hidden dark:block"
                  src="/images/logo/bca_logo.png"
                  alt="Logo"
                  width={450}
                  height={200}
                />
              </>
            ) : (
              <Image
                src="/images/logo/bca_logo.png"
                alt="Logo"
                width={450}
                height={200}
              />
            )}
          </Link>
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
                {renderMenuItems(navItems)}
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
