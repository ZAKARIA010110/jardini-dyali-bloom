
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center space-x-2 rtl:space-x-reverse ${className}`}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex items-center space-x-1 rtl:space-x-reverse"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>السابق</span>
            </Button>
          </PaginationItem>

          {getVisiblePages().map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <span className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1 rtl:space-x-reverse"
            >
              <span>التالي</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      
      <div className="text-sm text-gray-600 mr-4">
        صفحة {currentPage} من {totalPages}
      </div>
    </div>
  );
};
