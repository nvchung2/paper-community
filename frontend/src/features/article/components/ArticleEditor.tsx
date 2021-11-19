import { Paper, Stack } from "@mui/material";
import coverImage from "assets/cover.jpg";
import FTextField from "components/FTextField";
import LoadingButton from "components/LoadingButton";
import Markdown from "components/Markdown";
import RichTextField from "components/RichTextField";
import { useUploadImage } from "features/upload/useUpload";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { CreateOrUpdateArticle } from "../types";
import TagSelect from "./TagSelect";
import UploadButton from "./UploadButton";
interface Props {
  initialArticle?: CreateOrUpdateArticle;
  preview?: boolean;
  onSubmit: (
    article: CreateOrUpdateArticle,
    file: File | undefined,
    helper: FormikHelpers<CreateOrUpdateArticle>
  ) => any;
}
const schema = Yup.object({
  title: Yup.string().required().min(1).max(250),
  content: Yup.string().required().min(1),
  tags: Yup.array()
    .required()
    .min(1)
    .max(3)
    .of(
      Yup.object({
        name: Yup.string().min(3).max(30).required(),
      })
    ),
});
interface ContentTextFieldProps {
  onUploadFileDone: (markup: string) => any;
  onSelectEmoji: (emoji: string) => any;
}
function ContentTextField({
  onSelectEmoji,
  onUploadFileDone,
}: ContentTextFieldProps) {
  const upload = useUploadImage();
  const handleUpload = async (file: File) => {
    const { url } = await upload.mutateAsync(file);
    onUploadFileDone(`![Image](${url})`);
  };
  return (
    <RichTextField
      placeholder="Nội dung bài viết..."
      fullWidth
      multiline
      rows={5}
      name="content"
      onSelectFile={handleUpload}
      onSelectEmoji={onSelectEmoji}
      uploading={upload.isLoading}
      enableEmoji
      enableFileUpload
    />
  );
}
export default function ArticleEditor({
  initialArticle,
  preview = false,
  onSubmit,
}: Props) {
  const initialValues: CreateOrUpdateArticle = initialArticle || {
    content: "",
    coverImage: coverImage,
    tags: [],
    title: "",
  };
  const [file, setFile] = useState<File>();
  const handleFileSelect = (f: File) => {
    setFile(f);
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, helper) => {
        onSubmit(values, file, helper);
      }}
      validationSchema={schema}
      enableReinitialize
    >
      {({ isSubmitting, values, errors, touched, handleBlur, setFieldValue }) =>
        preview ? (
          <Paper sx={{ p: 3 }}>
            <Markdown>{values.content}</Markdown>
          </Paper>
        ) : (
          <Form>
            <Paper sx={{ p: 3, "&>*:not(:last-child)": { mb: 2 } }}>
              <UploadButton
                url={
                  values.coverImage
                    ? values.coverImage
                    : file
                    ? URL.createObjectURL(file)
                    : undefined
                }
                onSelect={handleFileSelect}
                onRemove={() => {
                  setFile(undefined);
                  setFieldValue("coverImage", "");
                }}
              />
              <FTextField
                sx={{ "& .MuiInputBase-root": { fontSize: "h3.fontSize" } }}
                placeholder="Tiêu đề bài viết..."
                fullWidth
                name="title"
              />
              <TagSelect
                value={values.tags.map((t) => t.name)}
                onChange={(v) => {
                  setFieldValue(
                    "tags",
                    v.map((name) => ({ name }))
                  );
                }}
                error={!!(touched.tags && errors.tags)}
                helperText={
                  touched.tags &&
                  errors.tags &&
                  (typeof errors.tags == "string"
                    ? errors.tags
                    : "Tên thẻ không hợp lệ (tên hợp lệ phải có 3-30 ký tự)")
                }
                onBlur={handleBlur}
              />
              <ContentTextField
                onSelectEmoji={(emoji) =>
                  setFieldValue("content", values.content + emoji)
                }
                onUploadFileDone={(markup) =>
                  setFieldValue("content", values.content + markup)
                }
              />
              <Stack direction="row" alignItems="center" spacing={2}>
                <LoadingButton
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  {initialArticle ? "Lưu chỉnh sửa" : "Xuất bản"}
                </LoadingButton>
              </Stack>
            </Paper>
          </Form>
        )
      }
    </Formik>
  );
}
