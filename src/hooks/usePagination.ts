import { useState, useMemo, useEffect } from "react";

interface UsePaginationProps<T> {
  data: T[];
  pageSize: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function usePagination<T>({
  data,
  pageSize,
  initialPage = 1,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(data.length / pageSize);

  useEffect(() => {
    // Ensure current page is within bounds when data changes
    if (currentPage < 1 || currentPage > totalPages) {
      setCurrentPage(Math.min(Math.max(1, currentPage), totalPages));
    }
  }, [totalPages, currentPage]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    setPage(currentPage + 1);
  };

  const prevPage = () => {
    setPage(currentPage - 1);
  };

  return {
    currentPage,
    totalPages,
    currentData,
    setPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
