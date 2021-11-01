import { UserPreview } from "features/profile/types";
import http from "lib/http";
import { QueryConfig } from "lib/react-query";
import { useQuery } from "react-query";

export function fetchAuth(): Promise<UserPreview> {
  return http.get("/auth/me");
}
export default function useAuthUser(config?: QueryConfig<typeof fetchAuth>) {
  return useQuery({
    queryKey: "auth",
    queryFn: fetchAuth,
    ...config,
  });
}
