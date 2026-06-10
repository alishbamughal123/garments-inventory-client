import { formControlClass } from "../ui/formStyles";

const SearchBar = ({
  search,
  setSearch,
}) => {
  return (
    <input
  type="text"
  placeholder="Search by style no, name, article, SKU, or barcode..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className={`${formControlClass} md:w-96`}
/>
  );
};

export default SearchBar;
