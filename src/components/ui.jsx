import React from "react";

export function BrutalistCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${className}`}
    >
      {children}
    </div>
  );
}

export function BrutalistButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const base =
    "font-black uppercase border-4 border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-[#A3E635] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]",
    danger:
      "bg-red-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]",
    secondary:
      "bg-gray-200 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]",
    small:
      "bg-[#A3E635] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] text-sm py-1 px-3",
    outline:
      "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}

export function BrutalistInput({ label, id, className = "", ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-lg font-black mb-1 uppercase">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full border-4 border-black p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-gray-100 ${className}`}
        {...props}
      />
    </div>
  );
}

export function BrutalistAlert({ children, variant = "error" }) {
  const colors = {
    error: "bg-red-200",
    success: "bg-green-200",
    info: "bg-blue-200",
  };

  return (
    <div
      className={`${colors[variant] || colors.error} border-2 border-black p-3 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
    >
      {children}
    </div>
  );
}

export function LoadingSpinner({ text = "Cargando..." }) {
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-2xl font-black uppercase animate-pulse">{text}</p>
    </div>
  );
}
