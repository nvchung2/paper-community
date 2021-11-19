import { Grid, Tab, Tabs } from "@mui/material";
import Empty from "components/Empty";
import InfiniteList from "components/InfiniteList";
import ArticleCard from "features/article/components/ArticleCard";
import { ArticleCardSekeleton } from "features/article/components/ArticleCard";
import { useArticles, useFeed } from "features/article/services";
import { Article } from "features/article/types";
import { useAuth } from "features/auth/AuthenticationProvider";
import SideMenu from "features/layout/components/SideMenu";
import React, { useState } from "react";
import TopTags from "./TopTags";
import TopUsers from "./TopUsers";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();
  const labels = [
    { value: "latest", text: "Mới nhất" },
    { value: "top", text: "Xem nhiều" },
  ];
  user && labels.unshift({ value: "feed", text: "Bảng tin" });
  const isFeedTab = labels[activeTab].value == "feed";
  const feed = useFeed({ enabled: !!user && isFeedTab });
  const sort = labels[activeTab].value;
  const articles = useArticles({ sort, config: { enabled: !isFeedTab } });
  const renderArticleList = () => {
    const renderPage = (list: Article[]) =>
      list.map((a) => <ArticleCard key={a.id} article={a} />);
    if (isFeedTab) {
      return (
        <InfiniteList
          queryResult={feed}
          placeholder={<ArticleCardSekeleton />}
          renderPage={renderPage}
          noContent={
            <Empty
              message="Không có bài viết nào trong bảng tin. Hãy theo dõi thẻ hoặc mọi người và các bài viết sẽ được hiển thị ở đây."
              height="40vh"
            />
          }
        />
      );
    }
    return (
      <InfiniteList
        queryResult={articles}
        placeholder={<ArticleCardSekeleton />}
        renderPage={renderPage}
      />
    );
  };
  const articleList = renderArticleList();
  return (
    <Grid container spacing={2}>
      <Grid item md={3} sx={{ display: { xs: "none", md: "block" } }}>
        <SideMenu />
      </Grid>
      <Grid item xs={12} sm={8} md={6}>
        <Tabs
          component="nav"
          sx={{ mb: 2 }}
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
        >
          {labels.map((l) => (
            <Tab key={l.value} label={l.text} />
          ))}
        </Tabs>
        {articleList}
      </Grid>
      <Grid item xs={12} sm={4} md={3}>
        <TopUsers />
        <TopTags />
      </Grid>
    </Grid>
  );
}
