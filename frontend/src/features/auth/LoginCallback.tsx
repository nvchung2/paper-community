import PageLoader from "components/PageLoader";
import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { useAuth } from "./AuthenticationProvider";

export default function LoginCallback({
  location,
  history,
}: RouteComponentProps) {
  const { login } = useAuth();
  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      login(token)
        .then(() => history.push("/"))
        .catch(() => history.push("/login"));
    } else {
      history.push("/login");
    }
  }, [location, history, login]);
  return <PageLoader message="Đang đăng nhập..." />;
}
