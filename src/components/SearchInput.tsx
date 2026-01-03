import React from "react";

interface SearchAndLimitProps {
  search: string;
  setSearch: (value: string) => void;
  limit: number;
  setLimit: (value: number) => void;
}

const SearchAndLimit: React.FC<SearchAndLimitProps> = ({
  search,
  setSearch,
  limit,
  setLimit,
}) => {
  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Tìm kiếm  ..."
        className="border p-2 rounded min-w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* <select
        className="border p-2 rounded"
        value={limit}
        onChange={(e) => setLimit(parseInt(e.target.value))}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
      </select> */}
    </div>
  );
};

export default SearchAndLimit;
