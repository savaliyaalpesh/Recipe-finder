import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Number of page buttons to show

    if (totalPages <= maxVisiblePages) {
      // If total pages are less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if current page is near the start
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      }

      // Adjust if current page is near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-center space-x-2">

        {/* Page Numbers */}
        <div className="flex items-center space-x-2">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? onPageChange(page) : null}
              disabled={page === '...'}
              className={`
    w-10 h-10 flex items-center justify-center rounded-lg border-2
    ${page === currentPage
                  ? 'bg-blue-600 text-white'
                  : page === '...'
                    ? 'bg-transparent text-gray-500 cursor-default'
                    : 'bg-transparent text-blue-500 hover:border-4 hover:border-blue-500'}
    transition-all duration-200 ease-in-out
  `}
            >
              {page}
            </button>

          ))}
        </div>

      </div>

      {/* Page Info */}
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;