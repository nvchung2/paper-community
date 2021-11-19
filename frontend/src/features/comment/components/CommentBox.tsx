import { Box, Button, Stack } from "@mui/material";
import LoadingButton from "components/LoadingButton";
import RichTextField from "components/RichTextField";
import { useAuth } from "features/auth/AuthenticationProvider";
import { Form, Formik, FormikHelpers } from "formik";
import React from "react";
import * as Yup from "yup";
import { Comment } from "../types";
import StyledAvatar from "./StyledAvatar";
interface Props {
  initialComment?: Comment;
  onSubmit: (
    values: { content: string },
    helper: FormikHelpers<{ content: string }>
  ) => any;
  isReply?: boolean;
  onDismiss?: () => any;
}
const schema = Yup.object({
  content: Yup.string().required().min(1),
});
export default function CommentBox({
  onSubmit,
  initialComment,
  isReply = false,
  onDismiss,
}: Props) {
  const { user } = useAuth();
  const initialValues = {
    content: initialComment?.content || "",
  };
  return (
    <Stack direction="row" spacing={1} mb={2} ml={isReply ? 2 : 0}>
      <StyledAvatar src={user?.avatar} />
      <Box flexGrow={1}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={schema}
        >
          {({ isSubmitting, resetForm, values, setFieldValue }) => (
            <Form>
              <RichTextField
                enableEmoji
                onSelectEmoji={(emoji) =>
                  setFieldValue("content", values.content + emoji)
                }
                name="content"
                placeholder="Nhập nội dung bình luận..."
                multiline
                rows={5}
                fullWidth
                sx={{ mb: 2 }}
              />
              <LoadingButton
                loading={isSubmitting}
                sx={{ mr: 1 }}
                variant="contained"
                type="submit"
              >
                Bình luận
              </LoadingButton>
              <Button
                sx={{ mr: 1 }}
                variant="contained"
                type="button"
                color="secondary"
                onClick={() => {
                  resetForm();
                  onDismiss?.();
                }}
              >
                Xóa
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Stack>
  );
}
