import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DropDown({ value, onChange, options, placeholder = "Select...", ...props }) {
    const navigate = useNavigate();
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);

    // Find if current url param matches any option value, else fallback to option 0 or value
    const currentSelection = options.find(
        opt => Object.values(params).some(val => val === opt.value) || opt.value === value
    ) || options[0];

    const handleSelect = (option) => {
        setIsOpen(false);
        if (onChange) {
            onChange(option);
        }
        if (option.targetPath) {
            navigate(option.targetPath);
        }
    };

    return (
        <div className="relative inline-block text-left w-full md:w-auto">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center justify-between gap-1.5 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 shadow-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-zinc-100 w-full md:w-auto"
            >
                <span>{placeholder || currentSelection?.label}</span>
                <svg
                    className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button> 

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    
                    <div className="absolute right-0 mt-2 z-50 w-52 origin-top-right rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-100">
                        {options.map((option) => {
                            const isActive = currentSelection?.value === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-emerald-600 text-white' 
                                            : 'text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}