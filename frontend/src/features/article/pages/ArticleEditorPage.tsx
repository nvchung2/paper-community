import { Divider, Grid, Tab, Tabs, Typography } from "@mui/material";
import coverImage from "assets/cover.jpg";
import ConfirmDialog from "components/ConfirmDialog";
import LoadingButton from "components/LoadingButton";
import PageLoader from "components/PageLoader";
import { useAuth } from "features/auth/AuthenticationProvider";
import { useUploadImage } from "features/upload/useUpload";
import { FormikHelpers } from "formik";
import React, { SyntheticEvent, useState } from "react";
import { RouteComponentProps } from "react-router";
import ArticleEditor from "../components/ArticleEditor";
import {
  useArticle,
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
} from "../services";
import { CreateOrUpdateArticle } from "../types";
type Params = { action: "new" | "edit"; id: string };
export default function ArticleEditorPage({
  match,
  history,
}: RouteComponentProps<Params>) {
  const isEdit = match.params.action == "edit";
  const updateArticle = useUpdateArticle({ id: match.params.id });
  const createArticle = useCreateArticle();
  const deleteArticle = useDeleteArticle();
  const upload = useUploadImage();
  const article = useArticle({
    id: match.params.id,
    config: { enabled: isEdit },
  });
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (e: SyntheticEvent, v: any) => {
    setActiveTab(v);
  };
  const handleSubmit = async (
    article: CreateOrUpdateArticle,
    file: File | undefined,
    helper: FormikHelpers<CreateOrUpdateArticle>
  ) => {
    try {
      if (file) {
        const { url } = await upload.mutateAsync(file);
        article.coverImage = url;
      }
      if (article.coverImage == "") {
        article.coverImage = coverImage;
      }
      if (isEdit) {
        await updateArticle.mutateAsync(article);
      } else {
        await createArticle.mutateAsync(article);
      }
      helper.resetForm();
      history.push(`/profile/${user!.id}/articles`);
    } catch {
      helper.setSubmitting(false);
    }
  };
  const handleDelete = async () => {
    await deleteArticle.mutateAsync(match.params.id);
    history.push(`/profile/${user!.id}/articles`);
  };
  if (isEdit && article.isLoading) {
    return <PageLoader message="Đang tải dữ liệu bài viết..." />;
  }
  return (
    <>
      <Typography variant="h4">
        {isEdit ? "Sửa bài viết" : "Tạo bài viết mới"}
      </Typography>
      <Tabs value={activeTab} sx={{ mb: 2 }} onChange={handleTabChange}>
        <Tab label="Biên tập" />
        <Tab label="Xem trước" />
      </Tabs>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <ArticleEditor
            onSubmit={handleSubmit}
            preview={activeTab == 1}
            initialArticle={isEdit ? article.data : undefined}
          />
        </Grid>
        <Grid item md={3} sx={{ display: ["none", null, "block"] }}>
          <Typography variant="h6">Hỗ trợ cú pháp markdown</Typography>
          <Typography variant="caption">Some markdown guide here</Typography>
        </Grid>
        {isEdit && (
          <Grid item xs={12} md={9}>
            <Divider
              id="dangerZone"
              textAlign="center"
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              Nguy hiểm!
            </Divider>
            <ConfirmDialog
              actionButton={
                <LoadingButton
                  loading={deleteArticle.isLoading}
                  sx={{ mb: 1 }}
                  variant="outlined"
                  color="error"
                >
                  Xóa bài viết này
                </LoadingButton>
              }
              message="Bạn có chắc muốn xóa bài viết này?"
              onAccept={handleDelete}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
}
