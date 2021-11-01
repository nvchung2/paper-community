import { AxiosError } from "axios";
import {
  QueryClient,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "react-query";
import { ErrorResponse } from "./http";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      useErrorBoundary: (error) => {
        const err = error as AxiosError<ErrorResponse>;
        return !!err.response && err.response.status != 401;
      },
    },
  },
});
type PromiseValue<T> = T extends PromiseLike<infer U> ? U : T;
export type QueryConfig<F extends (...args: any) => any> = UseQueryOptions<
  PromiseValue<ReturnType<F>>,
  AxiosError<ErrorResponse>
>;
export type InfiniteQueryConfig<F extends (...args: any) => any> =
  UseInfiniteQueryOptions<
    PromiseValue<ReturnType<F>>,
    AxiosError<ErrorResponse>
  >;
export type MutationConfig<F extends (...args: any) => any> =
  UseMutationOptions<
    PromiseValue<ReturnType<F>>,
    AxiosError<ErrorResponse>,
    Parameters<F>[0]
  >;
export default queryClient;
