import { FilterAlt } from "@mui/icons-material";
import {
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { ArticleCard } from "features/article";
import { ArticleCardSekeleton } from "features/article/components/ArticleCard";
import { TagPreview } from "features/tag/types";
import React, { ChangeEvent, SyntheticEvent, useMemo, useState } from "react";
import { useReadingList } from "./useReadingList";
export default function ReadingListPage() {
  const readingList = useReadingList();
  const tags = useMemo(() => {
    if (readingList.isSuccess) {
      return readingList.data.reduce<TagPreview[]>((p, c) => {
        return p.concat(c.tags.filter((t) => !p.find((e) => e.id == t.id)));
      }, []);
    }
    return [];
  }, [readingList.isSuccess, readingList.data]);
  const [activeTag, setActiveTag] = useState(0);
  const [filterText, setFilterText] = useState("");
  const handleFilterTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };
  const handleTagChange = (e: SyntheticEvent, v: any) => {
    setActiveTag(v);
  };
  let data = useMemo(() => {
    if (readingList.isSuccess) {
      return readingList.data.filter((a) =>
        a.tags.some((t) => t.id == tags[activeTag].id)
      );
    }
  }, [readingList.isSuccess, readingList.data, tags, activeTag]);
  data = data?.filter((a) => new RegExp(filterText, "i").test(a.title));
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Typography variant="h5">
          Reading List ({readingList.data?.length || 0})
        </Typography>
        <Tabs
          orientation="vertical"
          value={activeTag}
          onChange={handleTagChange}
        >
          {tags.map((t) => (
            <Tab
              sx={{ alignItems: "flex-start" }}
              label={`#${t.name}`}
              key={t.id}
            />
          ))}
        </Tabs>
      </Grid>
      <Grid item xs={12} md={9}>
        <TextField
          sx={{ mb: 2 }}
          placeholder="Enter some text to filter on..."
          size="small"
          fullWidth
          value={filterText}
          onChange={handleFilterTextChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterAlt />
              </InputAdornment>
            ),
          }}
        />
        {data
          ? data.map((a) => <ArticleCard key={a.id} article={a} />)
          : [...Array(10)].map((v, i) => <ArticleCardSekeleton key={i} />)}
      </Grid>
    </Grid>
  );
}
