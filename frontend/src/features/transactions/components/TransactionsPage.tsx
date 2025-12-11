"use client";

import React, { useState } from "react";
import { Typography, Grid, Box, Snackbar, Alert } from "@mui/material";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { useSearchParams } from "next/navigation";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { useCancelTransaction } from "@/features/transactions/hooks/useCancelTransaction";
import { TransactionCard } from "./TransactionCard";

export const TransactionsPage: React.FC = () => {
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
    severity: "success" as "success" | "error",
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
              <TransactionCard
                transaction={item}
                onCancel={handleCancel}
                isCancelling={cancelling}
              />
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

export default TransactionsPage;

