import create from "zustand";
interface State {
  token: string | null;
  setToken: (token: string) => any;
  removeToken: () => any;
}
const useToken = create<State>((set) => ({
  token: window.localStorage.getItem("token"),
  setToken: (token: string) => {
    set({ token });
    window.localStorage.setItem("token", token);
  },
  removeToken: () => {
    set({ token: null });
    window.localStorage.removeItem("token");
  },
}));
export default useToken;
