import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react'

type PageNavigatorProps = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

const getPageNumbers = (currentPage: number, totalPages: number): string[] => {
  const pages: string[] = [];
  
  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i.toString());
    }
  } else {
    // Always show first page
    pages.push('1');
    
    if (currentPage <= 4) {
      // Show pages 1, 2, 3, 4, 5, ..., last
      for (let i = 2; i <= 5; i++) {
        pages.push(i.toString());
      }
      pages.push('...');
      pages.push(totalPages.toString());
    } else if (currentPage >= totalPages - 3) {
      // Show pages 1, ..., last-4, last-3, last-2, last-1, last
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i.toString());
      }
    } else {
      // Show pages 1, ..., current-1, current, current+1, ..., last
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i.toString());
      }
      pages.push('...');
      pages.push(totalPages.toString());
    }
  }
  
  return pages;
};

export default function PageNavigator({
  page,
  pageSize,
  total,
  totalPages,
}: PageNavigatorProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentSort = searchParams.get('sort') || 'created_at_desc';

  const goToNextPage = () => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('page', String(Math.min(page + 1, totalPages)));
      navigate(`/cars?${newParams.toString()}`);
  };

  const goToPrevPage = () => {
      if (page <= 1) return;
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('page', String(Math.max(page - 1, 1)));
      navigate(`/cars?${newParams.toString()}`);
  };

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    navigate(`?${params.toString()}`);
  };
  
  return (
    <div className="flex items-center justify-center gap-1">
      {/* Previous Button */}
      <button
        className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={page <= 1}
        onClick={goToPrevPage}
      >
        ←
      </button>

      {/* Page Numbers */}
      {getPageNumbers(page, totalPages).map((pageNum, index) => {
        if (pageNum === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
              ...
            </span>
          );
        }
        
        const pageNumber = parseInt(pageNum);
        const isCurrentPage = pageNumber === page;
        
        return (
          <button
            key={pageNumber}
            onClick={() => updatePage(pageNumber)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isCurrentPage
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={page >= totalPages}
        onClick={goToNextPage}
      >
        →
      </button>
    </div>
  )
}
