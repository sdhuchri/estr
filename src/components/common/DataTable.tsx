"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { CustomListbox } from "./FormField";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: string[];
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  onRowAction?: (action: string, row: any) => void;
  actions?: Array<{
    label: string;
    action: string;
    className?: string;
    icon?: React.ReactNode;
  }>;
  loading?: boolean;
  emptyMessage?: string;
  title?: string;
  description?: string;
  headerActions?: React.ReactNode;
  searchRightActions?: React.ReactNode;
  // Checkbox props
  showCheckbox?: boolean;
  selectedRows?: string[];
  onCheckboxChange?: (id: string) => void;
  onSelectAll?: (checked: boolean) => void;
  getRowId?: (row: any) => string;
  // Table scroll props
  tableMinWidth?: string;
  fixedCardWidth?: boolean; // If true, card stays fixed and only table scrolls
  // Server-side pagination props
  serverSidePagination?: boolean;
  totalRecords?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageValue?: number; // Controlled value for items per page
}

function DataTable({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search anything..",
  searchFields = [],
  itemsPerPageOptions = [10, 25, 50],
  defaultItemsPerPage = 10,
  onRowAction,
  tableMinWidth,
  actions = [],
  loading = false,
  emptyMessage = "Tidak ada data yang ditemukan",
  title,
  description,
  headerActions,
  searchRightActions,
  showCheckbox = false,
  selectedRows = [],
  onCheckboxChange,
  onSelectAll,
  getRowId = (row) => row.id || row.NO,
  fixedCardWidth = false,
  // Server-side pagination
  serverSidePagination = false,
  totalRecords = 0,
  currentPage: externalCurrentPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageValue
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use external page if server-side pagination, otherwise use internal
  const currentPage = serverSidePagination ? (externalCurrentPage || 1) : internalCurrentPage;

  // Sync itemsPerPage with external value for server-side pagination
  useEffect(() => {
    if (serverSidePagination && itemsPerPageValue !== undefined) {
      setItemsPerPage(itemsPerPageValue);
    }
  }, [serverSidePagination, itemsPerPageValue]);

  // Update filtered data when data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Filter data based on search term
  useEffect(() => {
    if (!data.length) {
      setFilteredData([]);
      return;
    }

    let filtered = data;

    if (searchTerm.trim() && searchFields.length > 0) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = data.filter(item =>
        searchFields.some(field => 
          item[field]?.toString().toLowerCase().includes(searchLower)
        )
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, data, searchFields]);

  // Reset pagination only when search term changes
  useEffect(() => {
    if (!serverSidePagination) {
      setInternalCurrentPage(1);
    }
  }, [searchTerm, serverSidePagination]);

  // Handle page transition animation
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage]);

  // Calculate pagination
  const paginatedData = serverSidePagination 
    ? data // For server-side, data is already paginated
    : filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
  
  const totalPages = serverSidePagination
    ? Math.ceil(totalRecords / itemsPerPage)
    : Math.ceil(filteredData.length / itemsPerPage);

  const displayedRecordsCount = serverSidePagination ? totalRecords : filteredData.length;

  const generatePagination = (current: number, total: number): (number | "...")[] => {
    const range: (number | "...")[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) range.push(i);
    } else if (current <= 4) {
      range.push(1, 2, 3, 4, 5, "...", total);
    } else if (current >= total - 3) {
      range.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
    } else {
      range.push(1, "...", current - 1, current, current + 1, "...", total);
    }
    return range;
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeInSlide {
          animation: fadeInSlide 0.3s ease-out forwards;
        }
      `}</style>
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${fixedCardWidth ? 'overflow-hidden' : ''}`}>
      {/* Header Section */}
      {(title || description || searchable || headerActions) && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title and Description */}
            {(title || description) && (
              <div>
                {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
                {description && <p className="text-gray-600 mt-1">{description}</p>}
              </div>
            )}
            
            {/* Search and Actions */}
            <div className="flex gap-2">
              {headerActions}
              {searchable && (
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    maxLength={255}
                  />
                </div>
              )}
              {searchRightActions}
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className={fixedCardWidth ? "p-6" : "p-6"}>
        <div className={fixedCardWidth ? "overflow-x-auto w-full" : "overflow-x-auto"}>
          <table className="w-full border-collapse" style={tableMinWidth ? { minWidth: tableMinWidth } : undefined}>
              <thead>
                <tr style={{ backgroundColor: '#161950' }}>
                  {columns.map((column) => (
                    <th 
                      key={column.key}
                      className={`border border-gray-300 px-4 py-3 text-left text-sm font-medium text-white ${column.className || ''}`}
                    >
                      {column.label}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium text-white">
                      Action
                    </th>
                  )}
                  {showCheckbox && (
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium text-white w-12">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === data.length && data.length > 0}
                        onChange={(e) => onSelectAll?.(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + (actions.length > 0 ? 1 : 0) + (showCheckbox ? 1 : 0)} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (actions.length > 0 ? 1 : 0) + (showCheckbox ? 1 : 0)} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className={`border border-gray-300 px-4 py-3 text-sm text-gray-900 ${column.className || ''}`}>
                          <div className={`transition-all duration-300 ease-out ${
                            isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                          }`}>
                            {column.render 
                              ? column.render(item[column.key], item, (currentPage - 1) * itemsPerPage + index + 1)
                              : item[column.key]
                            }
                          </div>
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className={`flex justify-center gap-2 transition-all duration-300 ease-out ${
                            isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                          }`}>
                            {actions.map((action) => (
                              <button
                                key={action.action}
                                onClick={() => onRowAction?.(action.action, item)}
                                className={`px-3 py-1 rounded text-sm font-medium flex items-center justify-center gap-1 transition-colors ${
                                  action.className || 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                              >
                                {action.icon}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                      {showCheckbox && (
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className={`flex justify-center transition-all duration-300 ease-out ${
                            isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                          }`}>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(getRowId(item))}
                              onChange={() => onCheckboxChange?.(getRowId(item))}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
      </div>

      {/* Pagination Section */}
      {filteredData.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Tampilkan</span>
              <div className="w-20">
                <CustomListbox
                  value={itemsPerPage.toString()}
                  onChange={(value) => {
                    const newItemsPerPage = Number(value);
                    setItemsPerPage(newItemsPerPage);
                    if (serverSidePagination) {
                      onItemsPerPageChange?.(newItemsPerPage);
                    } else {
                      setInternalCurrentPage(1);
                    }
                  }}
                  options={itemsPerPageOptions.map(option => ({
                    value: option.toString(),
                    label: option.toString()
                  }))}
                  className="text-sm py-1"
                  dropUp={true}
                />
              </div>
              <span className="text-sm text-gray-700">data per halaman</span>
            </div>

            {/* Data count info - centered */}
            <div className="flex-1 text-center">
              <span className="text-sm text-gray-700">
                {serverSidePagination ? (
                  <>
                    Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalRecords)} dari {totalRecords.toLocaleString()} data
                  </>
                ) : (
                  <>
                    Menampilkan {paginatedData.length} dari {filteredData.length} data
                  </>
                )}
              </span>
            </div>

            <div className="flex gap-2 relative">
              <button
                onClick={() => {
                  const newPage = Math.max(currentPage - 1, 1);
                  if (serverSidePagination) {
                    onPageChange?.(newPage);
                  } else {
                    setInternalCurrentPage(newPage);
                  }
                }}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50 transition-all duration-200"
              >
                Prev
              </button>

              <div className="flex gap-2">
                {generatePagination(currentPage, totalPages).map((page, index) =>
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-1 text-sm text-gray-500 select-none">
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      onClick={() => {
                        const newPage = Number(page);
                        if (serverSidePagination) {
                          onPageChange?.(newPage);
                        } else {
                          setInternalCurrentPage(newPage);
                        }
                      }}
                      className={`px-3 py-1 border rounded text-sm transition-all duration-300 ease-out ${
                        currentPage === page
                          ? "text-white border-gray-300 scale-110 shadow-md"
                          : "bg-white text-black border-gray-300 hover:border-gray-400 hover:scale-105 opacity-0 animate-fadeInSlide"
                      }`}
                      style={currentPage === page ? { 
                        backgroundColor: '#161950',
                        animationDelay: `${index * 30}ms`
                      } : {
                        animationDelay: `${index * 30}ms`
                      }}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => {
                  const newPage = Math.min(currentPage + 1, totalPages);
                  if (serverSidePagination) {
                    onPageChange?.(newPage);
                  } else {
                    setInternalCurrentPage(newPage);
                  }
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50 transition-all duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default DataTable;