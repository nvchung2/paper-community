import { Grid, Typography } from "@mui/material";
import React from "react";
import { useTags } from "../services/useTag";
import TagCard, { TagCardSkeleton } from "../TagCard";

export default function TagListPage() {
  const tags = useTags();
  return (
    <>
      <Typography variant="h1" fontSize="h4.fontSize" fontWeight="bold" mb={2}>
        All Tags ({tags.data?.length})
      </Typography>
      <Grid container spacing={2}>
        {tags.isSuccess
          ? tags.data.map((tag) => (
              <Grid item xs={12} md={4} key={tag.id}>
                <TagCard tag={tag} />
              </Grid>
            ))
          : [...Array(10)].map((v, i) => (
              <Grid item xs={12} md={4} key={i}>
                <TagCardSkeleton />
              </Grid>
            ))}
      </Grid>
    </>
  );
}
