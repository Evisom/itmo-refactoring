import { CircularProgress, Box } from "@mui/material";
import "./LoadingSpinner.scss";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

const sizeMap = {
  small: 24,
  medium: 40,
  large: 56,
};

export const LoadingSpinner = ({
  size = "medium",
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const spinner = <CircularProgress size={sizeMap[size]} />;

  if (fullScreen) {
    return (
      <div className="container">
        {spinner}
      </div>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={2}>
      {spinner}
    </Box>
  );
};

export default LoadingSpinner;
