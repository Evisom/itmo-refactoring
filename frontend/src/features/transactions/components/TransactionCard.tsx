import React from "react";
import { Card, CardContent, Typography, Chip, Button } from "@mui/material";
import { TransactionResponse } from "@/shared/types/api";

interface TransactionCardProps {
  transaction: TransactionResponse;
  onCancel?: (transactionId: number) => void;
  isCancelling?: boolean;
}

const getChipColor = (status: string): "error" | "success" | "primary" | "default" => {
  switch (status) {
    case "REJECTED":
    case "DECLINED":
      return "error";
    case "APPROVED":
    case "RETURNED":
      return "success";
    case "PENDING":
      return "primary";
    default:
      return "default";
  }
};

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onCancel,
  isCancelling = false,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" color="textSecondary">
          {new Date(transaction.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="h6">Бронирование книги</Typography>
        <Typography>
          Книга: {transaction.bookCopy?.book?.title || "Неизвестно"} —{" "}
          {transaction.bookCopy?.book?.authors
            ? transaction.bookCopy.book.authors
                .map((a: { name: string; surname: string }) => `${a.name} ${a.surname}`)
                .join(", ")
            : "Не указан"}
        </Typography>
        <Typography>
          Библиотека: {transaction.bookCopy?.library?.name || "Не указана"}
        </Typography>
        <Typography>
          Инвентарный номер: {transaction.bookCopy?.inventoryNumber || "Не указан"}
        </Typography>

        <Chip
          sx={{ margin: "12px 0" }}
          label={transaction.status}
          color={getChipColor(transaction.status)}
          variant="outlined"
        />
        {transaction.status === "PENDING" && onCancel && (
          <Button
            sx={{ marginTop: "16px" }}
            variant="contained"
            fullWidth
            color="error"
            onClick={() => onCancel(transaction.id)}
            disabled={isCancelling}
          >
            Отменить
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionCard;

