import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../style/searchBar.module.css";
import { gql } from "@apollo/client";
import apolloClient from "../apolloclient";

type SearchUser = {
  name: string;
  id: string;
};

export const SearchBar = ({ setResults, setShowResults }: any) => {
  const [input, setInput] = useState("");

  const fetchData = async (value: string): Promise<SearchUser[] | null> => {
    try {
      const { data, errors } = await apolloClient.query({
        query: gql`
          query searchUser($input: SearchUserInput!) {
            searchUser(UserInput: $input) {
              name
              id
            }
          }
        `,
        variables: {
          input: { name: value }
        },
      });
      if (!data || errors) return [];
      setShowResults(true);
      return data.searchUser;

    } catch (error) {
      return [];
    }
  };

  const handleChange = async (value: string) => {
    setInput(value);
    if (value === "") {
      setResults([]);
      return;
    }
    const searchResults = await fetchData(value);
    setResults(searchResults);
  };

  return (
    <div className={`${styles.inputWrapper}`}>
      <FaSearch id="search-icon" className={styles.searchIcon} />
      <input
        placeholder="Type to search..."
        value={input}
        onChange={async (e) => await handleChange(e.target.value)}
      />
    </div>
  );
};