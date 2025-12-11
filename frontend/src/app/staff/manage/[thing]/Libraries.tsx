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
  TextField,
  Box,
} from "@mui/material";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useLibraries } from "@/features/books/hooks/useLibraries";
import { useCreateLibrary } from "@/features/books/hooks/useCreateLibrary";
import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";

const LibraryManagementPage = () => {
  useRequireAuth({ requiredRole: "ROLE_ADMIN" });
  const { libraries: librariesData, isLoading, error: librariesError } = useLibraries();
  const { createLibrary, isLoading: creating } = useCreateLibrary();

  const [newLibrary, setNewLibrary] = useState({
    name: "",
    address: "",
    openingTime: null,
    closingTime: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // Can be 'success' or 'error'
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (field: string, value: unknown) => {
    setNewLibrary((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLibrary = async () => {
    const { name, address, openingTime, closingTime } = newLibrary;

    if (!name || !address || !openingTime || !closingTime) {
      setSnackbar({
        open: true,
        message: "Заполните все поля",
        severity: "error",
      });
      return;
    }

    try {
      await createLibrary({
        name: name.trim(),
        address: address.trim(),
      });
      setSnackbar({
        open: true,
        message: "Библиотека успешно добавлена",
        severity: "success",
      });
      setNewLibrary({
        name: "",
        address: "",
        openingTime: null,
        closingTime: null,
      });
    } catch (error) {
      console.error("Ошибка при добавлении библиотеки:", error);
      setSnackbar({
        open: true,
        message: "Ошибка. Попробуйте позже",
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (librariesError) {
    return <Typography color="error">Ошибка загрузки библиотек</Typography>;
  }

  return (
    <Box>
      {/* Add New Library Form */}
      <Card sx={{ marginTop: "24px", marginBottom: "24px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Добавить новую библиотеку
          </Typography>
          <TextField
            label="Название"
            value={newLibrary.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Адрес"
            value={newLibrary.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            fullWidth
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <TimePicker
                label="Время открытия"
                value={newLibrary.openingTime}
                onChange={(newValue) =>
                  handleInputChange("openingTime", newValue)
                }
                ampm={false} // Disable AM/PM
                sx={{
                  flex: 1,
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
              <TimePicker
                label="Время закрытия"
                value={newLibrary.closingTime}
                sx={{
                  flex: 1,
                }}
                onChange={(newValue) =>
                  handleInputChange("closingTime", newValue)
                }
                ampm={false} // Disable AM/PM
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </div>
          </LocalizationProvider>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddLibrary}
            disabled={creating}
            fullWidth
            sx={{ marginTop: "10px" }}
          >
            Добавить
          </Button>
        </CardContent>
      </Card>

      {/* Libraries Table */}
      <TableContainer component={Card} style={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Адрес</TableCell>
              <TableCell>Время открытия</TableCell>
              <TableCell>Время закрытия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {librariesData && librariesData.length > 0 ? (
              librariesData.map((library) => (
                <TableRow key={library.id}>
                  <TableCell>{library.name}</TableCell>
                  <TableCell>{library.address || "Не указан"}</TableCell>
                  <TableCell>{library.openingTime || "Не указано"}</TableCell>
                  <TableCell>{library.closingTime || "Не указано"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Нет библиотек
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default LibraryManagementPage;
