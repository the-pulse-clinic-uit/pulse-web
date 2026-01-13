"use client";

import React, { ReactNode } from "react";

export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    className?: string;
    cell?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
}

const DataTable = <T,>({ data, columns }: DataTableProps<T>) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-base-200 overflow-hidden w-full">
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead className="bg-base-200/50 text-base-content/70">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`font-semibold text-xs ${
                                        col.className || ""
                                    }`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

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
                                            className={`text-xs ${
                                                col.className || ""
                                            }`}
                                        >
                                            {col.cell
                                                ? col.cell(row)
                                                : col.accessorKey
                                                ? (row[
                                                      col.accessorKey
                                                  ] as ReactNode)
                                                : null}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
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
        </div>
    );
};

export default DataTable;
