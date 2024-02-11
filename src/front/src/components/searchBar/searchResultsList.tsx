import styles from "../style/searchResultsList.module.css";
import { SearchResult } from "./searchResult";

export const SearchResultsList = ({ results }: any) => {
  return (
    <div className={`${styles.resultsList}`}>
      {results.map((result: any, id: string) => { // todo any
        return <SearchResult result={result.name} key={id} />;
      })}
    </div>
  );
};