import { Avatar, Box, Paper, Stack, styled, Typography } from "@mui/material";
import FTextField from "components/FTextField";
import LoadingButton from "components/LoadingButton";
import { useAuth } from "features/auth/AuthenticationProvider";
import { useUploadImage } from "features/upload/useUpload";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import useProfile, {
  UpdateUser,
  useUpdateProfile,
} from "../services/useProfile";

const FileInput = styled("input")(({ theme }) => ({
  width: "100%",
  border: theme.border,
  borderRadius: 5,
  padding: theme.spacing(1),
}));
const Label = styled("label")(({ theme }) => ({
  marginBottom: theme.spacing(1),
  display: "block",
  fontWeight: theme.typography.fontWeightBold,
}));
const FormGroup = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));
const schema = Yup.object({
  name: Yup.string().required().min(3).max(15),
  bio: Yup.string().required().min(3).max(30),
  email: Yup.string().required().email(),
  githubLink: Yup.string()
    .required()
    .url()
    .matches(/^https:\/\/github.com\//),
  location: Yup.string().required().min(3).max(30),
  work: Yup.string().required().min(3).max(30),
});
export default function EditProfilePage() {
  const { user } = useAuth();
  const { data: profile } = useProfile({
    id: user?.id,
  });
  const upload = useUploadImage();
  const updateProfile = useUpdateProfile();
  const [file, setFile] = useState<File | undefined>();
  const initialValues: UpdateUser = {
    avatar: profile?.avatar || "",
    bio: profile?.bio || "",
    email: profile?.email || "",
    githubLink: profile?.githubLink || "",
    location: profile?.location || "",
    name: profile?.name || "",
    work: profile?.work || "",
  };
  const handleSubmit = async (
    values: UpdateUser,
    helper: FormikHelpers<UpdateUser>
  ) => {
    if (file) {
      const { url } = await upload.mutateAsync(file);
      values.avatar = url;
    }
    await updateProfile.mutateAsync(values);
    helper.setSubmitting(false);
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={schema}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form>
          <Typography variant="h4">Edit Profile</Typography>
          <Paper sx={{ p: 2 }}>
            <FormGroup>
              <Label htmlFor="profile-img">Profile image</Label>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    borderColor: "primary.main",
                    color: (theme) => theme.border,
                  }}
                >
                  C
                </Avatar>
                <FileInput
                  type="file"
                  name="file"
                  id="profile-img"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0])}
                />
              </Stack>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <FTextField
                placeholder="Name..."
                id="name"
                name="name"
                fullWidth
                size="small"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <FTextField
                placeholder="Email..."
                name="email"
                id="email"
                fullWidth
                size="small"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="location">Location</Label>
              <FTextField
                name="location"
                placeholder="Location..."
                id="location"
                fullWidth
                size="small"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="bio">Bio</Label>
              <FTextField
                name="bio"
                placeholder="Bio..."
                id="bio"
                fullWidth
                size="small"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="work">Work</Label>
              <FTextField
                name="work"
                placeholder="Work..."
                id="work"
                fullWidth
                size="small"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="github">Github</Label>
              <FTextField
                name="githubLink"
                placeholder="https://github.com..."
                id="github"
                fullWidth
                size="small"
              />
            </FormGroup>
            <Box textAlign="right">
              <LoadingButton
                loading={isSubmitting}
                type="submit"
                variant="contained"
              >
                Save Profile Information
              </LoadingButton>
            </Box>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}
