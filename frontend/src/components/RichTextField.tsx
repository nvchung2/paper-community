import { EmojiEmotions, Image } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Popover,
  useTheme,
} from "@mui/material";
import { BaseEmoji, EmojiData, Picker } from "emoji-mart";
import { ChangeEvent, useState } from "react";
import FTextField, { FTextFieldProps } from "./FTextField";
import "emoji-mart/css/emoji-mart.css";
type Props = FTextFieldProps &
  Partial<{
    enableEmoji: boolean;
    onSelectEmoji: (emoji: string) => any;
    enableFileUpload: boolean;
    onSelectFile: (file: File) => any;
    uploading: boolean;
  }>;
export default function RichTextField({
  enableEmoji,
  onSelectEmoji,
  enableFileUpload,
  onSelectFile,
  uploading,
  sx,
  ...props
}: Props) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSelectFile) {
      onSelectFile(file);
    }
  };
  const handleClose = () => {
    setAnchor(undefined);
  };
  const handleEmojiSelect = (emoji: EmojiData) => {
    handleClose();
    onSelectEmoji && onSelectEmoji((emoji as BaseEmoji).native);
  };
  const [anchor, setAnchor] = useState<Element>();
  const theme = useTheme();
  return (
    <Box position="relative" sx={sx}>
      <FTextField fullWidth {...props} />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        position="absolute"
        right={0}
        bottom={0}
      >
        {enableEmoji && (
          <>
            <IconButton
              size="small"
              onClick={(e) => setAnchor(e.currentTarget)}
            >
              <EmojiEmotions fontSize="inherit" />
            </IconButton>
            <Popover open={!!anchor} anchorEl={anchor} onClose={handleClose}>
              <Picker
                set="twitter"
                onSelect={handleEmojiSelect}
                theme={theme.palette.mode}
                showPreview={false}
                title="Biểu tượng"
              />
            </Popover>
          </>
        )}
        {enableFileUpload && (
          <IconButton size="small" component="label" disabled={uploading}>
            {uploading ? (
              <CircularProgress size="1rem" />
            ) : (
              <Image fontSize="inherit" />
            )}
            <input
              id="image"
              hidden
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
