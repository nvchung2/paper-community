import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { ReactElement } from "react";
import { UseInfiniteQueryResult } from "react-query";
import { PaginationQueryResult } from "types";
import ContentLoader from "./ContentLoader";
interface Props<T> {
  queryResult: UseInfiniteQueryResult<PaginationQueryResult<T>>;
  renderPage: (page: T[]) => any;
  placeholder: ReactElement;
  noContent?: ReactElement | null;
}
export default function InfiniteList<T>({
  queryResult,
  renderPage,
  placeholder,
  noContent = null,
}: Props<T>) {
  if (queryResult.isSuccess) {
    if (queryResult.data.pages[0].list.length == 0) {
      return noContent;
    }
    return (
      <>
        {queryResult.data.pages.map((p) => renderPage(p.list))}
        {queryResult.isFetchingNextPage && (
          <ContentLoader count={1}>{placeholder}</ContentLoader>
        )}
        <Box textAlign="center" width="100%">
          {queryResult.hasNextPage && (
            <Button
              variant="contained"
              onClick={() => queryResult.fetchNextPage()}
            >
              Hiện thêm
            </Button>
          )}
        </Box>
      </>
    );
  }
  return <ContentLoader count={1}>{placeholder}</ContentLoader>;
}
