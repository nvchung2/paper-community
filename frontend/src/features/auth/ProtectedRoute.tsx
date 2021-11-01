import { Redirect, Route, RouteProps } from "react-router";
import { useAuth } from "./AuthenticationProvider";

export default function ProtectedRoute(props: RouteProps) {
  const { user } = useAuth();
  if (user) return <Route {...props} />;
  return <Redirect to="/login" />;
}
