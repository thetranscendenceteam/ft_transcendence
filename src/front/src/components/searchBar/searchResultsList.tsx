import "../style/searchResultsList.module.css";
import { SearchResult } from "./searchResult";

export const SearchResultsList = ({ results }: any) => {
  return (
    <div className="results-list">
      {results.map((name: any, id: string) => { // todo any
        return <SearchResult result={name} key={id} />;
      })}
    </div>
  );
};