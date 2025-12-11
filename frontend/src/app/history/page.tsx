"use client";

import React, { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Alert,
  Snackbar,
  Chip,
} from "@mui/material";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { useSearchParams } from "next/navigation";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { useCancelTransaction } from "@/features/transactions/hooks/useCancelTransaction";

const UserHistoryPage = () => {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");
  const { email } = useAuth();
  const targetEmail = userEmail || email || undefined;
  
  const { transactions: historyData, isLoading, mutate } = useTransactions(
    targetEmail ? { userId: targetEmail, page: 0, size: 100 } : undefined
  );
  const { cancelTransaction, isLoading: cancelling } = useCancelTransaction();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelTransaction(id);
      setSnackbar({
        open: true,
        message: "Бронирование успешно отменено",
        severity: "success",
      });
      mutate();
    } catch (err) {
      setSnackbar({
        open: true,
        message: (err as Error).message || "Ошибка при отмене бронирования",
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const getChipColor = (status: string) => {
    switch (status) {
      case "REJECTED": {
        return "error";
      }
      case "APPROVED": {
        return "success";
      }
      case "PENDING": {
        return "primary";
      }
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4">История пользователя {targetEmail}</Typography>
      {!historyData || historyData.length === 0 ? (
        <Typography>
          Пользователя с такой почтой нет или он не сделал ни одного действия
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ marginTop: "24px" }}>
          {historyData.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="textSecondary">
                    {new Date(item.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="h6">Бронирование книги</Typography>
                  <Typography>
                    Книга: {item.bookCopy?.book?.title || "Неизвестно"} —{" "}
                    {item.bookCopy?.book?.authors
                      ? item.bookCopy.book.authors
                          .map((a: { name: string; surname: string }) => `${a.name} ${a.surname}`)
                          .join(", ")
                      : "Не указан"}
                  </Typography>
                  <Typography>
                    Библиотека: {item.bookCopy?.library?.name || "Не указана"}
                  </Typography>
                  <Typography>
                    Инвентарный номер: {item.bookCopy?.inventoryNumber || "Не указан"}
                  </Typography>

                  <Chip
                    sx={{ margin: "12px 0" }}
                    label={item.status}
                    color={getChipColor(item.status)}
                    variant="outlined"
                  />
                  {item.status === "PENDING" && (
                    <Button
                      sx={{ marginTop: "16px" }}
                      variant="contained"
                      fullWidth
                      color="error"
                      onClick={() => handleCancel(item.id)}
                      disabled={cancelling}
                    >
                      Отменить
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
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

export default UserHistoryPage;
