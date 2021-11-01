import { Container } from "@mui/material";
import { useAuth } from "features/auth/AuthenticationProvider";
import { useNotificationsCount } from "features/notification/useNotification";
import React, { PropsWithChildren } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function Layout({ children }: PropsWithChildren<{}>) {
  const { user, logout } = useAuth();
  const { data } = useNotificationsCount({ enabled: !!user });
  return (
    <>
      <Header user={user} onLogout={logout} notificationsCount={data?.count} />
      <Container component="main" sx={{ mt: 10 }}>
        {children}
      </Container>
      <Footer />
    </>
  );
}
export { default as SideMenu } from "./components/SideMenu";
