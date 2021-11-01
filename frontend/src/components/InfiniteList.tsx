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
}
export default function InfiniteList<T>({
  queryResult,
  renderPage,
  placeholder,
}: Props<T>) {
  if (queryResult.isSuccess) {
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
              Show more
            </Button>
          )}
        </Box>
      </>
    );
  }
  return <ContentLoader count={1}>{placeholder}</ContentLoader>;
}
