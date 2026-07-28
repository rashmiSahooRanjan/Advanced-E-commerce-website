import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    return pages;
  };

  const pages = getPages();

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-8">

      {/* prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-3 rounded-xl border border-border bg-background hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>


      {/* pages */}
      {pages.map((page,index) => (
        <button
          key={`${page}-${index}`}
          disabled={page === "..."}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`min-w-[44px] h-11 px-4 rounded-xl font-medium transition-all ${
            page === currentPage
              ? "bg-primary text-primary-foreground"
              : page === "..."
              ? "cursor-default text-muted-foreground"
              : "border border-border bg-background text-foreground hover:bg-secondary"
          }`}
        >
          {page}
        </button>
      ))}


      {/* next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-3 rounded-xl border border-border bg-background hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

    </div>
  );
};

export default Pagination;