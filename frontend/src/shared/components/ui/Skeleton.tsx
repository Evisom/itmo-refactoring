import { Skeleton as MuiSkeleton, Box, Card, CardContent, Stack } from "@mui/material";

interface SkeletonProps {
  variant?: "text" | "rectangular" | "circular";
  width?: number | string;
  height?: number | string;
  animation?: "pulse" | "wave" | false;
}

export const Skeleton = ({
  variant = "rectangular",
  width,
  height,
  animation = "wave",
}: SkeletonProps) => {
  return (
    <MuiSkeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
    />
  );
};

export const BookCardSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Skeleton variant="text" width="80%" height={32} />
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Stack direction="row" spacing={2}>
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="40%" height={20} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => {
  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" width="100%" height={40} />
        ))}
      </Stack>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Stack key={rowIndex} direction="row" spacing={2} sx={{ mb: 1 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="rectangular"
              width={`${100 / columns}%`}
              height={56}
            />
          ))}
        </Stack>
      ))}
    </Box>
  );
};

export const ListSkeleton = ({ items = 5 }: { items?: number }) => {
  return (
    <Stack spacing={2}>
      {Array.from({ length: items }).map((_, index) => (
        <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" height={24} />
            <Skeleton variant="text" width="50%" height={20} />
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

export default Skeleton;
