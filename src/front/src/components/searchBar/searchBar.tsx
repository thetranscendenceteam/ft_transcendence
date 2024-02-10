import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../style/searchBar.module.css";

export const SearchBar = ({ setResults }: any) => {
  const [input, setInput] = useState("");

  const fetchData = (value: string) => {
    const toto = [{ name: "toto", id: "1" }, { name: "tata", id: "2" }];
    if (!value) {
      return [];
    }
    const filteredResults = toto.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    return filteredResults;
  };

  const handleChange = (value: string) => {
    setInput(value);
    const searchResults = fetchData(value);
    setResults(searchResults);
  };

  return (
    <div className={`${styles.inputWrapper}`}>
      <FaSearch id="search-icon" className={styles.searchIcon} />
      <input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};