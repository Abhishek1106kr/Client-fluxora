import React from "react";

const Select = ({
  label,
  id,
  value,
  onChange,
  options = [],
  required = false,
  error = "",
  helperText = "",
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
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3.5 py-2.5 bg-zinc-900 border text-sm text-zinc-100 rounded-lg focus:outline-none transition-all duration-200 cursor-pointer
          ${error
            ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
            : "border-zinc-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
          }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-900 text-zinc-100">
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="text-xs font-medium text-red-400">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-zinc-500">{helperText}</span>
      ) : null}
    </div>
  );
};

export default Select;
