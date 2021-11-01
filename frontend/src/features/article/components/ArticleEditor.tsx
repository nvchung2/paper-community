import { Paper, Stack } from "@mui/material";
import FTextField from "components/FTextField";
import LoadingButton from "components/LoadingButton";
import Markdown from "components/Markdown";
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
  title: Yup.string().required().min(3).max(200),
  content: Yup.string().required().min(10),
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
export default function ArticleEditor({
  initialArticle,
  preview = false,
  onSubmit,
}: Props) {
  const initialValues: CreateOrUpdateArticle = initialArticle || {
    content: "",
    coverImage: "",
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
                placeholder="Post title here..."
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
                    : "Invalid tag name (a valid tag name must be 3-30 characters")
                }
                onBlur={handleBlur}
              />
              <FTextField
                placeholder="Write your post content here..."
                fullWidth
                multiline
                rows={5}
                name="content"
              />
              <Stack direction="row" alignItems="center" spacing={2}>
                <LoadingButton
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  {initialArticle ? "Save" : "Publish"}
                </LoadingButton>
              </Stack>
            </Paper>
          </Form>
        )
      }
    </Formik>
  );
}
