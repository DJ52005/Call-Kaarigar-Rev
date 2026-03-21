import React from "react";

export function Input({ value, onChange, placeholder, className = "", type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-3 py-2 border rounded w-full ${className}`}
    />
  );
}
