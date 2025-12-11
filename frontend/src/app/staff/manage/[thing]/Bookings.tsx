"use client";

import React, { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useLibraries } from "@/features/books/hooks/useLibraries";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { useApproveTransaction } from "@/features/transactions/hooks/useApproveTransaction";
import { useDeclineTransaction } from "@/features/transactions/hooks/useDeclineTransaction";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";

const ApprovalsPage = () => {
  const [selectedLibrary, setSelectedLibrary] = useState<number | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [decliningRequestId, setDecliningRequestId] = useState<number | null>(
    null
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { libraries: librariesData, error: librariesError } = useLibraries();
  const { transactions: operationsData, isLoading: transactionsLoading, error: operationsError, mutate } = useTransactions(
    selectedLibrary ? { libraryId: selectedLibrary, status: "PENDING" } : undefined
  );
  const { approveTransaction, isLoading: approving } = useApproveTransaction();
  const { declineTransaction, isLoading: declining } = useDeclineTransaction();

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleApprove = async (requestId: number) => {
    try {
      await approveTransaction(requestId);
      setSnackbar({
        open: true,
        message: "Заявка успешно одобрена",
        severity: "success",
      });
      mutate();
    } catch (error) {
      console.error("Ошибка при одобрении заявки:", error);
      setSnackbar({
        open: true,
        message: "Ошибка при одобрении заявки",
        severity: "error",
      });
    }
  };

  const handleDecline = async () => {
    if (!decliningRequestId || !declineReason.trim()) return;

    try {
      await declineTransaction(decliningRequestId, { comment: declineReason });
      setSnackbar({
        open: true,
        message: "Заявка успешно отклонена",
        severity: "success",
      });
      setDeclineDialogOpen(false);
      setDeclineReason("");
      mutate();
    } catch (error) {
      console.error("Ошибка при отклонении заявки:", error);
      setSnackbar({
        open: true,
        message: "Ошибка при отклонении заявки",
        severity: "error",
      });
    }
  };

  if (!librariesData) return <LoadingSpinner fullScreen />;
  if (librariesError)
    return <Typography color="error">Ошибка загрузки библиотек</Typography>;
  if (operationsError)
    return <Typography color="error">Ошибка загрузки заявок</Typography>;

  return (
    <div>
      {/* Library Selection */}
      <Card style={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h6">Выберите библиотеку</Typography>
          <Select
            value={selectedLibrary || ""}
            onChange={(e) => setSelectedLibrary(Number(e.target.value))}
            fullWidth
          >
            <MenuItem value="" disabled>
              Выберите филиал
            </MenuItem>
            {librariesData && librariesData.length > 0 ? librariesData.map((library) => (
              <MenuItem key={library.id} value={library.id}>
                {library.name}
              </MenuItem>
            )) : (
              <MenuItem value="" disabled>
                Нет библиотек
              </MenuItem>
            )}
          </Select>
        </CardContent>
      </Card>

      {/* Reservation Requests */}
      {selectedLibrary ? (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Книга</TableCell>
                <TableCell>Автор</TableCell>
                <TableCell>Inventory ID</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <LoadingSpinner />
                  </TableCell>
                </TableRow>
              ) : operationsData && operationsData.length > 0 ? (
                operationsData.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.bookCopy?.book?.title || "Неизвестно"}</TableCell>
                    <TableCell>
                      {request.bookCopy?.book?.authors && request.bookCopy.book.authors.length > 0
                        ? request.bookCopy.book.authors
                            .map((author: { name: string; surname: string }) => `${author.name} ${author.surname}`)
                            .join(", ")
                        : "Не указан"}
                    </TableCell>
                    <TableCell>{request.bookCopy?.inventoryNumber || "Не указан"}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(request.id)}
                        disabled={approving}
                      >
                        Одобрить
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        style={{ marginLeft: "10px" }}
                        onClick={() => {
                          setDecliningRequestId(request.id);
                          setDeclineDialogOpen(true);
                        }}
                        disabled={declining}
                      >
                        Отклонить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Нет заявок
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}

      {/* Decline Reason Dialog */}
      <Dialog
        open={declineDialogOpen}
        onClose={() => setDeclineDialogOpen(false)}
      >
        <DialogTitle>Причина отказа</DialogTitle>
        <DialogContent>
          <TextField
            label="Причина"
            multiline
            rows={4}
            fullWidth
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeclineDialogOpen(false)} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDecline} color="error" disabled={declining}>
            Отклонить
          </Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
};

export default ApprovalsPage;
