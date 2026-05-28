const SearchBar = ({
  search,
  setSearch,
}) => {
  return (
    <input
  type="text"
  placeholder="Search by Name, SKU, Barcode..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="
    w-full
    md:w-96
    bg-white
    border
    border-slate-200
    rounded-xl
    px-5
    py-3
    outline-none
    focus:ring-2
    focus:ring-indigo-500
  "
/>
  );
};

export default SearchBar;