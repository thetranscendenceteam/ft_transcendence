import { useRouter } from "next/navigation";
import "../style/searchResult.module.css";

export const SearchResult = ({ result }: any) => {
  const router = useRouter();
  return (
    <div
      className="search-result z-50"
      onClick={() => router.push(`/user/${result}`)}
    >
      {result}
    </div>
  );
};
