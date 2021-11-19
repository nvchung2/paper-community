import { FocusEvent } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useTags } from "features/tag/services";
interface Props {
  onChange: (value: string[]) => any;
  value?: string[];
  error?: boolean;
  helperText?: string;
  onBlur: (e: FocusEvent<HTMLInputElement>) => any;
}
export default function TagSelect({
  onChange,
  value,
  error,
  helperText,
  onBlur,
}: Props) {
  const tags = useTags();
  return (
    <Autocomplete
      multiple
      freeSolo
      options={tags.isSuccess ? tags.data.map((t) => t.name) : []}
      loading={tags.isLoading}
      renderInput={(params) => (
        <TextField
          error={error}
          helperText={helperText}
          {...params}
          placeholder="Tối đa 3 thẻ. Ít nhất 1 thẻ..."
          fullWidth
          onBlur={onBlur}
          name="tags"
        />
      )}
      onChange={(e, v) => {
        onChange(v);
      }}
      value={value}
    />
  );
}
