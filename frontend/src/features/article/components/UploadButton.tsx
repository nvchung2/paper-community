import { Button, Stack, styled } from "@mui/material";
import React, { ChangeEvent, useRef } from "react";
const ImagePreview = styled("div")({
  width: 150,
  height: "auto",
  overflow: "hidden",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 5,
  },
});
interface Props {
  onSelect: (file: File) => any;
  url?: string;
  onRemove: () => any;
}
export default function UploadButton({ onSelect, url, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      onSelect(file);
    }
  };
  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onRemove();
  };
  return (
    <Stack flexWrap="wrap" direction="row" alignItems="center">
      {url && (
        <ImagePreview sx={{ mr: 2 }}>
          <img src={url} alt="prev" />
        </ImagePreview>
      )}
      <div>
        <label htmlFor="thumb">
          <input
            ref={inputRef}
            onChange={handleFileChange}
            accept="image/*"
            type="file"
            id="thumb"
            hidden
          />
          <Button component="span" variant="outlined">
            {url ? "Thay đổi" : "Thêm ảnh"}
          </Button>
        </label>
        {url && (
          <Button variant="text" color="error" onClick={handleRemove}>
            Xóa
          </Button>
        )}
      </div>
    </Stack>
  );
}
