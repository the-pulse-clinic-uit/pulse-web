"use client";
import { Filter, Search } from "lucide-react";

interface ToolbarProps {
    buttonName?: string;
    onSearch?: (value: string) => void;
    onFilter?: () => void;
    onAdd?: () => void;
}

const Toolbar = ({ buttonName, onSearch, onFilter, onAdd }: ToolbarProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                <button
                    onClick={onFilter}
                    className="btn btn-outline border-base-300 text-base-content/70 hover:bg-base-200 hover:border-base-300 font-medium normal-case bg-white gap-2 px-5"
                >
                    <Filter size={18} />
                    <span>Filter</span>
                </button>

                <label className="input input-bordered flex items-center gap-3 w-full max-w-md bg-white text-base-content/70 focus-within:text-base-content">
                    <Search size={20} className="text-base-content/50" />
                    <input
                        type="text"
                        className="grow placeholder:text-base-content/40"
                        placeholder="Search"
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                </label>
            </div>

            <div className="w-full md:w-auto">
                <button
                    onClick={onAdd}
                    className="btn btn-primary text-white normal-case px-6 w-full md:w-auto gap-2 shadow-sm"
                >
                    Add to {buttonName}
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
