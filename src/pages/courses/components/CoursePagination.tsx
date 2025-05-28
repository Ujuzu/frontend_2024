import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IMeta } from '@/Interfaces/IMeta';


interface CoursePaginationProps {
  meta: IMeta | null;
  currentPage: number;
  goToPage: (page: number) => void;
}

const CoursePagination: React.FC<CoursePaginationProps> = ({
  meta,
  currentPage,
  goToPage
}) => {
  if (!meta || meta.pagination.pageCount <= 0) {
    return null;
  }

  // Function to render pagination items
  const renderPaginationItems = () => {
    if (!meta || meta.pagination.pageCount <= 1) return null;
    
    const items = [];
    const maxVisiblePages = 5;
    
    // Logic for which page numbers to show
    let startPage = 1;
    let endPage = meta.pagination.pageCount;
    
    if (meta.pagination.pageCount > maxVisiblePages) {
      // Calculate start and end page
      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
        // Near the start
        endPage = maxVisiblePages;
      } else if (currentPage >= meta.pagination.pageCount - Math.floor(maxVisiblePages / 2)) {
        // Near the end
        startPage = meta.pagination.pageCount - maxVisiblePages + 1;
      } else {
        // Middle
        startPage = currentPage - Math.floor(maxVisiblePages / 2);
        endPage = currentPage + Math.floor(maxVisiblePages / 2);
      }
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => goToPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => goToPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add last page and ellipsis if needed
    if (endPage < meta.pagination.pageCount) {
      if (endPage < meta.pagination.pageCount - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => goToPage(meta.pagination.pageCount)}>
            {meta.pagination.pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{meta.pagination.total > 0 ? (currentPage - 1) * meta.pagination.pageSize + 1 : 0}</span> to{" "}
          <span className="font-medium">{Math.min(currentPage * meta.pagination.pageSize, meta.pagination.total)}</span> of{" "}
          <span className="font-medium">{meta.pagination.total}</span> results
        </p>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => goToPage(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => goToPage(currentPage + 1)}
                className={currentPage === meta?.pagination.pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default CoursePagination;