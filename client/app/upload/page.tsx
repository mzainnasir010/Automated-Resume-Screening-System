"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen } from "lucide-react";
import { AppShell } from "@/components/ui/AppShell";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { FileListItem } from "@/components/ui/FileListItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useScreening } from "@/lib/store";
import { UploadedFile } from "@/lib/types";
import { uploadResumes } from "@/lib/api";

function makeId() {
  return Math.random().toString(36).slice(2);
}

export default function UploadPage() {
  const router = useRouter();
  const { files, setFiles } = useScreening();
  const [submitting, setSubmitting] = useState(false);

  const handleFilesSelected = (incoming: File[]) => {
    const existingNames = new Set(files.map((f) => f.name));
    const next: UploadedFile[] = incoming.map((file) => {
      if (file.type !== "application/pdf") {
        return { id: makeId(), file, name: file.name, size: file.size, status: "error", error: "Only PDF files are supported" };
      }
      if (file.size === 0) {
        return { id: makeId(), file, name: file.name, size: file.size, status: "error", error: "File is empty" };
      }
      if (existingNames.has(file.name)) {
        return { id: makeId(), file, name: file.name, size: file.size, status: "error", error: "Duplicate file" };
      }
      return { id: makeId(), file, name: file.name, size: file.size, status: "ready" };
    });
    setFiles([...files, ...next]);
  };

  const handleRemove = (id: string) => setFiles(files.filter((f) => f.id !== id));
  const readyFiles = files.filter((f) => f.status === "ready");

  const handleContinue = async () => {
    setSubmitting(true);
    try {
      await uploadResumes(readyFiles.map((f) => f.file));
      router.push("/job-description");
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <h1 className="text-xl font-semibold">Upload Resumes</h1>
      <p className="mt-1 text-sm text-muted">Select PDF files to screen, supports large batches.</p>

      <div className="mt-6">
        <UploadDropzone onFilesSelected={handleFilesSelected} />
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium">Files</p>
        {files.length === 0 ? (
          <EmptyState icon={FolderOpen} title="No files selected" description="Drag and drop PDFs above to get started." />
        ) : (
          <div className="max-h-80 overflow-y-auto rounded-xl border border-border bg-surface">
            {files.map((f) => (
              <FileListItem key={f.id} file={f} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <Button variant="secondary" onClick={() => router.push("/")}>Cancel</Button>
        <div className="text-right">
          <Button disabled={readyFiles.length === 0 || submitting} onClick={handleContinue}>
            {submitting ? "Uploading..." : "Continue"}
          </Button>
          {readyFiles.length === 0 && <p className="mt-2 text-xs text-muted">Add at least one PDF to continue</p>}
        </div>
      </div>
    </AppShell>
  );
}