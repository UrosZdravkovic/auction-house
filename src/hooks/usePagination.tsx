// hooks/usePagination.ts
import { useState } from "react";
import { type Auction } from "../types/auction"; 

interface UsePaginationOptions {
  itemsPerPage: number;
}

export function usePagination(items: Auction[] | undefined, options: UsePaginationOptions) {
  const { itemsPerPage } = options;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [displayPage, setDisplayPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalItems = items?.length ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedItems = items?.slice(
    (displayPage - 1) * itemsPerPage,
    displayPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page === currentPage || isTransitioning) return;
    if (page < 1 || page > totalPages) return;

    setIsTransitioning(true);
    setCurrentPage(page);

    setTimeout(() => {
      setDisplayPage(page);
      setIsTransitioning(false);
    }, 150);
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    paginatedItems,
    isTransitioning,
    goToPage,
  };
}