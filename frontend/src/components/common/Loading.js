import React from "react";

const Loading = ({ size = "medium", color = "var(--color-primary)" }) => {
  // Size configurations
  const sizes = {
    small: {
      width: "20px",
      height: "20px",
      border: "2px",
    },
    medium: {
      width: "30px",
      height: "30px",
      border: "3px",
    },
    large: {
      width: "40px",
      height: "40px",
      border: "4px",
    },
  };

  const selectedSize = sizes[size] || sizes.medium;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: selectedSize.width,
          height: selectedSize.height,
          border: `${selectedSize.border} solid ${color}`,
          borderBottomColor: "transparent",
          borderRadius: "50%",
          display: "inline-block",
          animation: "rotation 1s linear infinite",
        }}
      />
      <style>
        {`
          @keyframes rotation {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export const LoadingOverlay = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Loading size="large" />
    </div>
  );
};

export default Loading;
