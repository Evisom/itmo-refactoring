"use client";

import React from "react";
import { Skeleton as MuiSkeleton, Box, Card, CardContent } from "@mui/material";

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: number | string;
  height?: number | string;
  animation?: "pulse" | "wave" | false;
}

export const Skeleton = ({
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) => {
  return <MuiSkeleton variant={variant} width={width} height={height} animation={animation} />;
};

export const BookCardSkeleton = () => {
  return (
    <Card>
      <MuiSkeleton variant="rectangular" height={200} />
      <CardContent>
        <MuiSkeleton variant="text" width="80%" height={32} />
        <MuiSkeleton variant="text" width="60%" height={24} />
        <MuiSkeleton variant="text" width="40%" height={20} />
      </CardContent>
    </Card>
  );
};

export const TransactionCardSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <MuiSkeleton variant="text" width="60%" height={32} />
          <MuiSkeleton variant="rectangular" width={80} height={24} />
        </Box>
        <MuiSkeleton variant="text" width="80%" height={20} />
        <MuiSkeleton variant="text" width="70%" height={20} />
        <MuiSkeleton variant="text" width="50%" height={20} />
      </CardContent>
    </Card>
  );
};

export const RatingCardSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <MuiSkeleton variant="text" width="40%" height={24} />
          <MuiSkeleton variant="rectangular" width={120} height={20} />
        </Box>
        <MuiSkeleton variant="text" width="100%" height={20} />
        <MuiSkeleton variant="text" width="30%" height={16} />
      </CardContent>
    </Card>
  );
};

export default Skeleton;
