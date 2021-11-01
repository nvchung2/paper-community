import { CssBaseline, ThemeProvider } from "@mui/material";
import ErrorBoundary from "components/ErrorBoundary";
import PageLoad from "components/PageLoader";
import SnackbarList from "components/SnackbarList";
import { AuthProvider } from "features/auth/AuthenticationProvider";
import LoginRequiredDialog from "features/auth/LoginRequiredDialog";
import ProtectedRoute from "features/auth/ProtectedRoute";
import Layout from "features/layout";
import { darkTheme, lightTheme, useThemeMode } from "hooks/useThemeMode";
import queryClient from "lib/react-query";
import { Suspense } from "react";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import routes from "routes";

export default function App() {
  const mode = useThemeMode((state) => state.mode);
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={mode ? darkTheme : lightTheme}>
          <CssBaseline />
          <Suspense fallback={<PageLoad />}>
            <BrowserRouter>
              <AuthProvider>
                <LoginRequiredDialog />
                <SnackbarList />
                <Layout>
                  <Switch>
                    {routes.map((r, index) =>
                      r.isProtected ? (
                        <ProtectedRoute {...r} key={index} />
                      ) : (
                        <Route {...r} key={index} />
                      )
                    )}
                  </Switch>
                </Layout>
              </AuthProvider>
            </BrowserRouter>
          </Suspense>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
