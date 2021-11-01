import create from "zustand";
import { nanoid } from "nanoid";
interface Toast {
  id: string;
  variant: "success" | "error" | "info";
  message: string;
}
interface State {
  snackbars: Toast[];
  success: (message: string) => any;
  error: (message: string) => any;
  info: (message: string) => any;
  remove: (id: string) => any;
}
const useSnackbar = create<State>((set) => {
  const addToast = (message: string, variant: Toast["variant"]) => {
    set((state) => ({
      snackbars: [...state.snackbars, { id: nanoid(), message, variant }],
    }));
  };
  return {
    snackbars: [],
    info: (message) => {
      addToast(message, "info");
    },
    success: (message) => {
      addToast(message, "success");
    },
    error: (message) => {
      addToast(message, "error");
    },
    remove: (id) => {
      set((state) => {
        const index = state.snackbars.findIndex((t) => t.id == id);
        return {
          snackbars: [
            ...state.snackbars.slice(0, index),
            ...state.snackbars.slice(index + 1),
          ],
        };
      });
    },
  };
});
export default useSnackbar;
