"use client";

import React, { ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho một Cột
export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    className?: string;
    cell?: (row: T) => ReactNode;
}

// Định nghĩa Props mà bảng chấp nhận
interface DataTableProps<T> {
    data: T[]; // Dữ liệu đầu vào (Mảng generic T)
    columns: ColumnDef<T>[]; // Cấu hình cột tương ứng với T
}

// Component Bảng Generic
const DataTable = <T,>({ data, columns }: DataTableProps<T>) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-base-200">
            <table className="table w-full">
                {/* HEADER */}
                <thead className="bg-base-200/50 text-base-content/70">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`font-semibold ${
                                    col.className || ""
                                }`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* BODY */}
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="border-b border-base-100 last:border-none hover:bg-base-50"
                            >
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={col.className || ""}
                                    >
                                        {col.cell
                                            ? col.cell(row) // Ưu tiên dùng hàm cell custom
                                            : col.accessorKey
                                            ? (row[
                                                  col.accessorKey
                                              ] as ReactNode) // Lấy dữ liệu từ key
                                            : null}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        // Hiển thị khi không có dữ liệu
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center py-8 text-base-content/50"
                            >
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
