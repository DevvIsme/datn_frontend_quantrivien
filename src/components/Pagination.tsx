import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const paginationNumbers = getPaginationNumbers();

  return (
    <div className="flex justify-center mt-4">
      {/* Chỉ hiện khi không ở trang đầu */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 mx-1 border rounded"
        >
          «
        </button>
      )}

      {paginationNumbers.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === page ? "bg-blue-500 text-white" : ""
              }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-3 py-1 mx-1">
            {page}
          </span>
        )
      )}

      {/* Chỉ hiện khi không ở trang cuối */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 mx-1 border rounded"
        >
          »
        </button>
      )}
    </div>
  );
};

export default Pagination;
