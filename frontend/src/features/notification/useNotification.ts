import http from "lib/http";
import { MutationConfig, QueryConfig } from "lib/react-query";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Notification } from "./types";

function fetchNotifications(): Promise<Notification[]> {
  return http.get("/notifications");
}
function fetchNotificationsCount(): Promise<{ count: number }> {
  return http.get("/notifications/unread_count");
}
function markNotificationsAsRead() {
  return http.post("/notifications/read");
}
export function useNotifications(
  config?: QueryConfig<typeof fetchNotifications>
) {
  return useQuery({
    queryKey: "notification",
    queryFn: fetchNotifications,
    ...config,
  });
}
export function useNotificationsCount(
  config?: QueryConfig<typeof fetchNotificationsCount>
) {
  return useQuery({
    queryKey: ["notification", "count"],
    queryFn: fetchNotificationsCount,
    ...config,
  });
}
export function useMarkNotificationsAsRead(
  config?: MutationConfig<typeof markNotificationsAsRead>
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess: () => {
      client.invalidateQueries(["notification", "count"]);
    },
    ...config,
  });
}
