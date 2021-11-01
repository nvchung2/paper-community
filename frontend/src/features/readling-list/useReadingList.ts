import { Article } from "features/article/types";
import http from "lib/http";
import { QueryConfig } from "lib/react-query";
import { useQuery } from "react-query";

function fetchReadingList(): Promise<Article[]> {
  return http.get("/articles/reading-list");
}
export function useReadingList(config?: QueryConfig<typeof fetchReadingList>) {
  return useQuery({
    queryKey: "reading-list",
    queryFn: fetchReadingList,
    ...config,
  });
}
