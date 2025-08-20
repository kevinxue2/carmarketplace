import { useNavigate, useSearchParams } from 'react-router-dom';

type PageNavigatorProps = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export default function PageNavigator({
  page,
  pageSize,
  total,
  totalPages,
}: PageNavigatorProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
