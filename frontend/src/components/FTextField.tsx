import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";

export type FTextFieldProps = TextFieldProps & { name: string };
export default function FTextField({ name, ...props }: FTextFieldProps) {
  const [field, meta] = useField(name);
  const hasError = !!(meta.touched && meta.error);
  return (
    <TextField
      {...field}
      {...props}
      error={hasError}
      helperText={hasError ? meta.error : undefined}
    />
  );
}
