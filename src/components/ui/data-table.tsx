import * as React from "react";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "./pagination";

interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (value: any) => React.ReactNode;
  }[];
  pageSize?: number;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  pageSize = 10,
  className,
  ...props
}: DataTableProps<T>) {
  const {
    currentPage,
    totalPages,
    currentData,
    setPage,
  } = usePagination({
    data,
    pageSize,
    initialPage: 1,
  });

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {currentData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className="p-4 align-middle"
                    >
                      {column.cell
                        ? column.cell(row[column.accessorKey])
                        : row[column.accessorKey] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}