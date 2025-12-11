"use client";

import { Alert, Snackbar } from "@mui/material";
import { useState, useEffect } from "react";

interface ErrorAlertProps {
  error: string | null;
  onClose?: () => void;
  autoHideDuration?: number;
}

export const ErrorAlert = ({
  error,
  onClose,
  autoHideDuration = 5000,
}: ErrorAlertProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!error);
  }, [error]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  if (!error) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorAlert;
