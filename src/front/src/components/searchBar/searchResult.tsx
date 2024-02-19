import "../style/searchResult.module.css";

const redirectToUser = (username: string) => {
  window.location.href = `/user/${username}`;
}

export const SearchResult = ({ result }: any) => {
  return (
    <div
      className="search-result z-50"
      onClick={() => redirectToUser(result)}
    >
      {result}
    </div>
  );
};
