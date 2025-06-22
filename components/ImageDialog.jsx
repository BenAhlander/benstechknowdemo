"use client";

import { useRouter } from "next/navigation";
import { useState, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Dialog modal displaying a full-size image, with options to copy link or delete.
 */
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ImageDialog({ open, onClose, name, image }) {
  const router = useRouter();
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(image);
      setToast({ open: true, message: "Link copied to clipboard", severity: "success" });
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Failed to copy link", severity: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await fetch("/api/avatar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: image }),
      });
      onClose();
      router.refresh();
      setToast({ open: true, message: "Image deleted", severity: "success" });
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Failed to delete image", severity: "error" });
    }
  };

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {name}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <img src={image} alt={name} style={{ width: "100%" }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopy}>Copy Link</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleToastClose} severity={toast.severity}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}