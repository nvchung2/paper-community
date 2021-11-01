import "@mui/material/styles";
declare module "@mui/material/styles" {
  export interface Theme {
    border: string;
  }
  interface ThemeOptions {
    border: string;
  }
}
