import { Grid, Typography } from "@mui/material";
import ContentLoader from "components/ContentLoader";
import React from "react";
import { useTags } from "../services";
import TagCard, { TagCardSkeleton } from "../TagCard";

export default function TagListPage() {
  const tags = useTags();
  return (
    <>
      <Typography variant="h1" fontSize="h4.fontSize" fontWeight="bold" mb={2}>
        Tất cả thẻ ({tags.data?.length})
      </Typography>
      <Grid container spacing={2}>
        {tags.isSuccess ? (
          tags.data.map((tag) => (
            <Grid item xs={12} md={4} key={tag.id}>
              <TagCard tag={tag} />
            </Grid>
          ))
        ) : (
          <ContentLoader count={10}>
            <Grid item xs={12} md={4}>
              <TagCardSkeleton />
            </Grid>
          </ContentLoader>
        )}
      </Grid>
    </>
  );
}
