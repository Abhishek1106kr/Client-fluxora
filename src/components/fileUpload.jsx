import React, { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud, FileText, X } from "lucide-react";
import { toast } from "react-toastify";

const FileUpload = ({ onUploadSuccess, accept = ".pdf,.docx", label = "Click or drag to add your resume", allowedTypesText = "Supports PDF or DOCX formats up to 5MB" }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    
    const onFileChange = (event) => {
        if (event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const onFileUpload = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!selectedFile) {
            toast.error("Please select a file first");
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002';
      axios.post(`${backendUrl}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then(res => {
            setIsUploading(false);
            if (res.data.success) {
                toast.success(res.data.message || "File uploaded successfully!");
                if (onUploadSuccess) {
                    onUploadSuccess(res.data.fileUrl);
                }
            } else {
                toast.error(res.data.message || "Upload failed");
            }
        })
        .catch(err => {
            setIsUploading(false);
            console.error("Upload error:", err);
            toast.error(err.response?.data?.message || "Error uploading file");
        });
    };

    const clearFile = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full font-sans">
            <label className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 transition-all duration-200 cursor-pointer group relative overflow-hidden">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                    {!selectedFile ? (
                        <>
                            {/* Dropzone Empty State */}
                            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-700 transition-colors mb-3">
                                <UploadCloud className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-semibold text-zinc-200 tracking-tight">
                                {label}
                            </p>
                            <p className="text-xs text-zinc-550 mt-1.5 font-medium">
                                {allowedTypesText}
                            </p>
                        </>
                    ) : (
                        <>
                            {/* File Staged Active State */}
                            <div className="p-3 rounded-xl bg-[#0052CC]/10 border border-[#0052CC]/30 text-[#0052CC] mb-3 animate-in scale-in duration-100">
                                <FileText className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-semibold text-zinc-200 max-w-[280px] truncate">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1 font-mono">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>

                            {/* Staged File Action Buttons */}
                            <div className="flex gap-2 mt-4" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={onFileUpload}
                                    disabled={isUploading}
                                    className="px-4 py-1.5 bg-[#0052CC] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                                >
                                    {isUploading ? "Uploading..." : "Upload File"}
                                </button>
                                <button
                                    onClick={clearFile}
                                    className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={onFileChange}
                    className="hidden"
                />
            </label>
        </div>
    );
};

export default FileUpload;