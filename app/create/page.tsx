"use client";

import {
  Alert,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import Card from "@/components/Card";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Unstable_Grid2";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Create() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });
  const [activeAvatar, setActiveAvatar] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showError, setShowError] = useState(false);

  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const generateImage = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/generateImage", {
        method: "POST",
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      setActiveAvatar(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const saveAvatar = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/avatar", {
        method: "POST",
        body: JSON.stringify(activeAvatar),
      });
      const data = await response.json();
      console.log(data);
      setActiveAvatar(null);
      setFormValues({
        name: "",
        description: "",
      });
      setIsSaving(false);
      setShowError(false);
      setShowSuccessAlert(true);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      setShowError(true);
      setShowSuccessAlert(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: "16px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">Create New Avatar</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="name"
              fullWidth
              label="Name"
              variant="outlined"
              onChange={handleChange}
              value={formValues.name}
              placeholder="Bob"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="description"
              multiline
              name="description"
              onChange={handleChange}
              placeholder="A giraffe with a jet pack"
              rows={4}
              value={formValues.description}
              variant="outlined"
            />
          </Grid>
          {!activeAvatar ? (
            <Grid item xs={12}>
              <LoadingButton
                loading={isLoading}
                fullWidth
                variant="contained"
                onClick={generateImage}
              >
                Generate Image
              </LoadingButton>
            </Grid>
          ) : (
            <>
              <Grid item xs={6}>
                <LoadingButton
                  loading={isLoading}
                  fullWidth
                  variant="contained"
                  onClick={generateImage}
                >
                  Try Again
                </LoadingButton>
              </Grid>
              <Grid item xs={6}>
                <LoadingButton
                  loading={isSaving}
                  fullWidth
                  variant="contained"
                  onClick={saveAvatar}
                >
                  Save
                </LoadingButton>
              </Grid>
              <Grid item xs={12}>
                <Card
                  name={activeAvatar.name}
                  image={activeAvatar.image_url}
                  description={activeAvatar.description}
                />
              </Grid>
            </>
          )}
          {showSuccessAlert && (
            <Grid item xs={12}>
              <Alert
                onClose={() => {
                  setShowSuccessAlert(false);
                }}
                action={
                  <>
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => {
                        router.push("/");
                        router.refresh();
                      }}
                    >
                      Check It Out
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => setShowSuccessAlert(false)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </>
                }
              >
                Your Avatar Has Been Added To the Board!
              </Alert>
            </Grid>
          )}
          {showError && (
            <Grid item xs={12}>
              <Alert
                onClose={() => {
                  setShowError(false);
                }}
                severity="error"
                action={
                  <IconButton size="small" onClick={() => setShowError(false)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                There was an error saving the avatar. Please try again.
              </Alert>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
}
