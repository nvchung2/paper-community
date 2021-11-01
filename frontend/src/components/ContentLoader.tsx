import React, { PropsWithChildren } from "react";

interface Props {
  count?: number;
}
export default function ContentLoader({
  count,
  children,
}: PropsWithChildren<Props>) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <React.Fragment key={index}>{children}</React.Fragment>
      ))}
    </>
  );
}
