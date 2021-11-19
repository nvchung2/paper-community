import { Grid, Tab, Tabs, Typography } from "@mui/material";
import ContentLoader from "components/ContentLoader";
import React, { SyntheticEvent, useState } from "react";
import NotificationCard, { NotificationCardSkeleton } from "./NotificationCard";
import { useMarkNotificationsAsRead, useNotifications } from "./services";
const notificationFilters = ["Tất cả", "Bình luận", "Bài viết"];
export default function NotificationPage() {
  const [activeFilter, setActiveFilter] = useState(0);
  const handleFilter = (e: SyntheticEvent, v: any) => {
    setActiveFilter(v);
  };
  const markAsRead = useMarkNotificationsAsRead();
  const notis = useNotifications({
    onSuccess: () => markAsRead.mutate(undefined),
  });
  const renderNotis = () => {
    if (!notis.isSuccess) {
      return (
        <ContentLoader count={5}>
          <NotificationCardSkeleton />
        </ContentLoader>
      );
    }
    let data = notis.data;
    if (activeFilter > 0) {
      data = data.filter(({ notifiableType }) => {
        return activeFilter == 1
          ? notifiableType == "comment" || notifiableType == "reply"
          : notifiableType == "article";
      });
    }
    return data.map((n) => <NotificationCard key={n.id} noti={n} />);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Typography variant="h5">Thông báo</Typography>
        <Tabs
          orientation="vertical"
          value={activeFilter}
          onChange={handleFilter}
        >
          {notificationFilters.map((f) => (
            <Tab sx={{ alignItems: "flex-start" }} label={f} key={f} />
          ))}
        </Tabs>
      </Grid>
      <Grid item xs={12} md={9}>
        {renderNotis()}
      </Grid>
    </Grid>
  );
}
