/**
 * Loading State Component
 *
 * Reusable loading indicator with optional message.
 */
import React from "react";
import { Loader } from "@vibe/core";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  size = "medium",
  className = "",
}) => {
  return (
    <div className={`loading-container ${className}`}>
      <Loader size={size} />
      {message && <div className="loading-message">{message}</div>}
    </div>
  );
};
