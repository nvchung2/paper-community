import PageLoader from "components/PageLoader";
import { UserPreview } from "features/profile/types";
import useToken from "hooks/useToken";
import { createContext, ReactNode, useContext } from "react";
import { useQueryClient } from "react-query";
import useAuthUser from "./services";

interface ContextValues {
  user: UserPreview | undefined;
  login: (token: string) => any;
  logout: () => any;
}
const authContext = createContext<ContextValues | null>(null);
interface Props {
  children: ReactNode;
}
export function AuthProvider({ children }: Props) {
  const { token, removeToken, setToken } = useToken();
  const client = useQueryClient();
  const auth = useAuthUser({
    enabled: !!token,
  });
  const login = async (token: string) => {
    setToken(token);
    await auth.refetch();
  };
  const logout = () => {
    removeToken();
    client.clear();
  };
  if (auth.isLoading) return <PageLoader />;
  return (
    <authContext.Provider
      value={{
        user: auth.data,
        login,
        logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
export function useAuth() {
  const auth = useContext(authContext);
  if (!auth) throw new Error();
  return auth;
}
