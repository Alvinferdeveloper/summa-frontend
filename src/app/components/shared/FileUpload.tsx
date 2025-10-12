import React, { useEffect, useRef, useState } from "react";

interface FileUploadProps {
    label?: string;
    value?: File | null;
    onChange?: (file: File | null) => void;
    accept?: string;
    maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
    label = "Subir archivo",
    value,
    onChange,
    accept = "image/*",
    maxSizeMB = 2,
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (value) {
            const objectUrl = URL.createObjectURL(value);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            onChange?.(null);
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`El archivo debe ser menor a ${maxSizeMB} MB`);
            return;
        }

        onChange?.(file);
        setError(null);
    };

    const handleRemove = () => {
        onChange?.(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium">{label}</label>}

            <div className="flex items-center gap-4">
                {/* Preview */}
                {preview && (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="preview"
                            className="w-16 h-16 object-cover rounded border"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute cursor-pointer top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                        >
                            ×
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    accept={accept}
                    ref={inputRef}
                    onChange={handleFileChange}
                    className="border p-3 rounded w-full h-12 cursor-pointer"
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default FileUpload;
