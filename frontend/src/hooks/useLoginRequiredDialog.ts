import create from "zustand";
interface State {
  show: boolean;
  toggleDialog: () => any;
}
const useLoginRequiredDialog = create<State>((set) => ({
  show: false,
  toggleDialog: () => {
    set((state) => ({ show: !state.show }));
  },
}));
export default useLoginRequiredDialog;
