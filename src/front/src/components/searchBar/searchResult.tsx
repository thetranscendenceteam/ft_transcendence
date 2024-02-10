import "../style/searchResult.module.css";

export const SearchResult = ({ result }: any) => {
  return (
    <div
      className="search-result"
      onClick={(e) => alert(`You selected ${result}!`)}
    >
      {result}
    </div>
  );
};