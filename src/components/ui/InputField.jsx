import React from "react";

const InputField = ({
  label,
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  error = "",
  helperText = "",
  className = "",
  icon: Icon = null,
  ...props
}) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Icon size={16} />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-3.5 py-2.5 bg-zinc-900 border text-sm text-zinc-100 rounded-lg placeholder:text-zinc-600 focus:outline-none transition-all duration-200
            ${Icon ? "pl-10" : ""}
            ${error
              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
              : "border-zinc-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
            }`}
          {...props}
        />
      </div>
      {error ? (
        <span className="text-xs font-medium text-red-400">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-zinc-500">{helperText}</span>
      ) : null}
    </div>
  );
};

export default InputField;
