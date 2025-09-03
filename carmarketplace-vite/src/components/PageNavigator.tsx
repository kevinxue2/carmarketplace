import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react'

type PageNavigatorProps = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type SortOption = {
  value: string
  label: string
}

const sortOptions: SortOption[] = [
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'created_at_asc', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'year_desc', label: 'Year: Newest First' },
  { value: 'year_asc', label: 'Year: Oldest First' },
  { value: 'kilometers_asc', label: 'Mileage: Low to High' },
  { value: 'kilometers_desc', label: 'Mileage: High to Low' }
];

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

    const handleSortChange = (sortValue: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('sort', sortValue)
        navigate(`/cars?${newParams.toString()}`);
    };
  return (
    <div className="flex items-center justify-between gap-4 p-2 border rounded-xl shadow-sm text-sm">
      <button
        className="px-3 py-1 rounded-lg border text-gray-200 hover:bg-gray-100 disabled:opacity-50"
        disabled={page <= 1}
        onClick={() => goToPrevPage()}
      >
        Prev
      </button>

      <div className="text-gray-200">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span> •{" "}
        Showing <span className="font-medium">{pageSize}</span> per page •{" "}
        Total: <span className="font-medium">{total}</span>
      </div>

             <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <span>Sort by</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      currentSort === option.value 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                    {currentSort === option.value && (
                      <span className="float-right">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      

      <button
        className="px-3 py-1 rounded-lg border text-gray-200 hover:bg-gray-100 disabled:opacity-50"
        disabled={page >= totalPages}
        onClick={() => goToNextPage()}
      >
        Next
      </button>
    </div>
  )
}
