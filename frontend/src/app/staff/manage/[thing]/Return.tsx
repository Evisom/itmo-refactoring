"use client";

import React, { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useReturnTransaction } from "@/features/transactions/hooks/useReturnTransaction";

const Return = () => {
  const { returnTransaction, isLoading: returning } = useReturnTransaction();
  const [invNumber, setInvNumber] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleReturn = async () => {
    if (!invNumber.trim()) {
      setSnackbar({
        open: true,
        message: "Пожалуйста, введите инвентарный номер",
        severity: "error",
      });
      return;
    }

    try {
      await returnTransaction({ invNumber: invNumber.trim() });
      setSnackbar({
        open: true,
        message: "Книга успешно возвращена",
        severity: "success",
      });
      setInvNumber("");
    } catch (error) {
      console.error("Ошибка при возврате книги:", error);
      setSnackbar({
        open: true,
        message: "Ошибка. Этот номер не забронирован",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Вернуть книгу
          </Typography>
          <TextField
            label="Инвентарный номер"
            value={invNumber}
            onChange={(e) => setInvNumber(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleReturn}
            disabled={returning}
            fullWidth
            sx={{ marginTop: "10px" }}
          >
            Вернуть
          </Button>
        </CardContent>
      </Card>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Return;
