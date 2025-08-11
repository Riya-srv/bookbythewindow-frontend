import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchBook, setSearchBook] = useState("");

  return (
    <SearchContext.Provider value={{ searchBook, setSearchBook }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
