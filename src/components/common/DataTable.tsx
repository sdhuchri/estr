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
  actions = [],
  loading = false,
  emptyMessage = "Tidak ada data yang ditemukan",
  title,
  description,
  headerActions
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);


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
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate pagination
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
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
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
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
                          {column.render 
                            ? column.render(item[column.key], item, (currentPage - 1) * itemsPerPage + index + 1)
                            : item[column.key]
                          }
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                  options={itemsPerPageOptions.map(option => ({
                    value: option.toString(),
                    label: option.toString()
                  }))}
                  className="text-sm py-1"
                />
              </div>
              <span className="text-sm text-gray-700">data per halaman</span>
            </div>

            {/* Data count info - centered */}
            <div className="flex-1 text-center">
              <span className="text-sm text-gray-700">
                Menampilkan {paginatedData.length} dari {filteredData.length} data
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>

              {generatePagination(currentPage, totalPages).map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-3 py-1 text-sm text-gray-500 select-none">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(Number(page))}
                    className={`px-3 py-1 border rounded text-sm transition-all ${
                      currentPage === page
                        ? "text-white border-gray-300"
                        : "bg-white text-black border-gray-300 hover:border-gray-400"
                    }`}
                    style={currentPage === page ? { backgroundColor: '#161950' } : {}}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;