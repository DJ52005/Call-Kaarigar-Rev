import React from "react";

export const Button = ({ onClick, children, variant = "default", type = "button" }) => {
  const base = "px-4 py-2 rounded-xl font-medium transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
};
