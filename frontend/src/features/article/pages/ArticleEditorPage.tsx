import {
  Alert,
  AlertTitle,
  Divider,
  Grid,
  Link as MuiLink,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ConfirmDialog from "components/ConfirmDialog";
import LoadingButton from "components/LoadingButton";
import PageLoader from "components/PageLoader";
import { useAuth } from "features/auth/AuthenticationProvider";
import { useUploadImage } from "features/upload/useUpload";
import { FormikHelpers } from "formik";
import React, { SyntheticEvent, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import ArticleEditor from "../components/ArticleEditor";
import {
  useArticle,
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
} from "../services/useArticle";
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
    if (file) {
      const { url } = await upload.mutateAsync(file);
      article.coverImage = url;
    }
    if (isEdit) {
      await updateArticle.mutateAsync(article);
    } else {
      await createArticle.mutateAsync(article);
    }
    helper.setSubmitting(false);
    helper.resetForm();
    history.push(`/profile/${user!.id}/articles`);
  };
  const handleDelete = async () => {
    await deleteArticle.mutateAsync(match.params.id);
    history.push(`/profile/${user!.id}/articles`);
  };
  if (isEdit) {
    if (article.isLoading) {
      return <PageLoader message="Loading article data..." />;
    }
    if (
      (article.isError && article.error.response?.status == 404) ||
      (article.isSuccess && article.data.author.id != user?.id)
    ) {
      return (
        <Alert severity="error">
          <AlertTitle>404 - NOT FOUND</AlertTitle>
          Sorry! We can not found your article.{" "}
          <MuiLink component={Link} to="/">
            Go Home
          </MuiLink>
        </Alert>
      );
    }
  }
  return (
    <>
      <Typography variant="h4">
        {isEdit ? "Edit Article" : "Create New Article"}
      </Typography>
      <Tabs value={activeTab} sx={{ mb: 2 }} onChange={handleTabChange}>
        <Tab label="Edit" />
        <Tab label="Preview" />
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
          <Typography variant="h6">Writing a great post title</Typography>
          <Typography variant="caption">
            Think of your post title as a super short (but compelling!)
            description — like an overview of the actual post in one short
            sentence. Use keywords where appropriate to help ensure people can
            find your post by search.
          </Typography>
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
              DANGER ZONE
            </Divider>
            <ConfirmDialog
              actionButton={
                <LoadingButton
                  loading={deleteArticle.isLoading}
                  sx={{ mb: 1 }}
                  variant="outlined"
                  color="error"
                >
                  Delete this article
                </LoadingButton>
              }
              message="Are you sure you want to delete this article?"
              onAccept={handleDelete}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
}
