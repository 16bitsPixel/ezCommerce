import { PropsWithChildren, useState, createContext } from "react";

export const SearchContext = createContext({
  searchTerm: '',
  setSearchTerm: (term: string) => {} // eslint-disable-line
})

export const SearchProvider = ({children}: PropsWithChildren<{}>) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <SearchContext.Provider value={{searchTerm, setSearchTerm}}>
      {children}
    </SearchContext.Provider>
  )
}