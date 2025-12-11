"use client";

import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { TransactionResponse } from "@/features/transactions/services/transactions-api";

interface TransactionCardProps {
  transaction: TransactionResponse;
  onClick?: () => void;
}

const statusColors: Record<string, "default" | "primary" | "success" | "warning" | "error"> = {
  PENDING: "warning",
  APPROVED: "success",
  DECLINED: "error",
  RETURNED: "primary",
  CANCELLED: "default",
};

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает",
  APPROVED: "Одобрена",
  DECLINED: "Отклонена",
  RETURNED: "Возвращена",
  CANCELLED: "Отменена",
};

export const TransactionCard = ({ transaction, onClick }: TransactionCardProps) => {
  const bookTitle = transaction.bookCopy?.book?.title || "Неизвестная книга";
  const libraryName = transaction.bookCopy?.library?.name || "Неизвестная библиотека";
  const authors = transaction.bookCopy?.book?.authors
    ?.map((a) => `${a.name} ${a.surname}`)
    .join(", ") || "Неизвестный автор";

  return (
    <Card
      sx={{
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? { boxShadow: 4 } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="div">
            {bookTitle}
          </Typography>
          <Chip
            label={statusLabels[transaction.status] || transaction.status}
            color={statusColors[transaction.status] || "default"}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Автор: {authors}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Библиотека: {libraryName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Инвентарный номер: {transaction.bookCopy?.inventoryNumber || "N/A"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Создано: {new Date(transaction.createdAt).toLocaleDateString("ru-RU")}
        </Typography>
        {transaction.updatedAt && (
          <Typography variant="body2" color="text.secondary">
            Обновлено: {new Date(transaction.updatedAt).toLocaleDateString("ru-RU")}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
