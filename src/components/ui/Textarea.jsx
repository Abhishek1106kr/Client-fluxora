import React from "react";

const Textarea = ({
  label,
  id,
  placeholder = "",
  value,
  onChange,
  required = false,
  error = "",
  helperText = "",
  rows = 4,
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`w-full px-3.5 py-2.5 bg-zinc-900 border text-sm text-zinc-100 rounded-lg placeholder:text-zinc-600 focus:outline-none transition-all duration-200 resize-y
          ${error
            ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
            : "border-zinc-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
          }`}
        {...props}
      />
      {error ? (
        <span className="text-xs font-medium text-red-400">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-zinc-500">{helperText}</span>
      ) : null}
    </div>
  );
};

export default Textarea;
