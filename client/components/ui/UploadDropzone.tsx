"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { clsx } from "clsx";

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

export function UploadDropzone({ onFilesSelected }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      onFilesSelected(Array.from(fileList));
    },
    [onFilesSelected]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={clsx(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center transition-colors",
        isDragging ? "border-accent bg-accent/5" : "border-border bg-surface hover:border-muted"
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-hover">
        <UploadCloud className="h-5 w-5 text-muted" />
      </div>
      <p className="text-sm font-medium">Drop your resumes here</p>
      <p className="text-xs text-muted">
        or <span className="text-accent underline underline-offset-2">browse files</span>, PDF only
      </p>
      <input ref={inputRef} type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}