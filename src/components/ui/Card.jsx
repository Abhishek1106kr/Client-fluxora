import React from "react";

const Card = ({
  children,
  className = "",
  hoverable = false,
  asymmetric = false,
  ...props
}) => {
  const baseStyles = "bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden";
  
  const hoverStyles = hoverable
    ? "transition-all duration-200 hover:-translate-y-[2px] hover:border-zinc-700 hover:shadow-xl hover:shadow-emerald-950/5"
    : "";

  const asymmetricStyles = asymmetric
    ? "shadow-[4px_4px_0px_0px_rgba(16,185,129,0.1)] border-emerald-900/30"
    : "shadow-md shadow-black/20";

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${asymmetricStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
