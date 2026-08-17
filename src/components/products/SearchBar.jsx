import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = ({
  search,
  setSearch,
  placeholder = "Search by style no, name, article, SKU, or barcode...",
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <FiSearch
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-0.5 rounded-full hover:bg-slate-200/60"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
