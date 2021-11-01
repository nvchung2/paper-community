import { blue } from "@mui/material/colors";
import { createTheme, ThemeOptions } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import create from "zustand";
type State = {
  mode: boolean;
  toggleMode: () => any;
};
export const useThemeMode = create<State>((set) => ({
  mode: false,
  toggleMode: () => set((state) => ({ mode: !state.mode })),
}));
const baseTheme: ThemeOptions = {
  border: "1px solid rgba(0,0,0,.2)",
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: `1px solid ${blue[500]}`,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
    },
  },
};
export const lightTheme = createTheme(
  deepmerge(baseTheme, {
    palette: {
      mode: "light",
      divider: "rgba(0,0,0,.2)",
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundColor: "rgba(255,255,255,.7)" },
        },
      },
    },
  })
);
export const darkTheme = createTheme(
  deepmerge(baseTheme, {
    palette: {
      mode: "dark",
      divider: "rgba(255,255,255,.2)",
    },
    border: "1px solid rgba(255,255,255,.2)",
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundColor: "rgba(0,0,0,.7)" },
        },
      },
    },
  })
);
