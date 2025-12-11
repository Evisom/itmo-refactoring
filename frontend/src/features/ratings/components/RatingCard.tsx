import React from "react";
import { Card, CardContent, Typography, Rating } from "@mui/material";
import { RatingResponse } from "@/shared/types/api";

interface RatingCardProps {
  rating: RatingResponse;
}

export const RatingCard: React.FC<RatingCardProps> = ({ rating }) => {
  const ratingValue = rating.ratingValue ?? rating.rating ?? 0;
  const comment = rating.review ?? rating.comment ?? "Без текста";
  const createdAt = rating.time ?? rating.createdAt;
  
  return (
    <Card sx={{ marginBottom: "16px", marginTop: "16px" }}>
      <CardContent>
        <Rating value={ratingValue} readOnly />
        <Typography>{comment}</Typography>
        <Typography variant="body2" color="textSecondary">
          {createdAt ? new Date(createdAt).toLocaleString() : "Неизвестное время"}
        </Typography>
        {rating.user && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Пользователь: {rating.user.username}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingCard;

