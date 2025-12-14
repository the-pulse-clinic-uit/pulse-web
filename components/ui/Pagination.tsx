import { ChevronLeft, ChevronRight } from "lucide-react";

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
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-center justify-between w-full max-w-3xl mx-auto p-4">
            <button
                className={`btn btn-outline btn-sm gap-2 normal-case font-medium text-base-content/60 border-base-300 hover:border-base-400 hover:bg-base-200 ${
                    currentPage === 1 ? "btn-disabled opacity-50" : ""
                }`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft size={16} />
                Previous
            </button>

            <div className="join">
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        className={`join-item btn btn-sm border-none font-medium ${
                            currentPage === number
                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                : "btn-ghost text-base-content/60"
                        }`}
                        onClick={() => onPageChange(number)}
                    >
                        {number}
                    </button>
                ))}
            </div>

            <button
                className={`btn btn-outline btn-sm gap-2 normal-case font-medium text-base-content/60 border-base-300 hover:border-base-400 hover:bg-base-200 ${
                    currentPage === totalPages ? "btn-disabled opacity-50" : ""
                }`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;
