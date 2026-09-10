import { FileText, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { UploadedFile } from "@/lib/types";
import { clsx } from "clsx";

interface FileListItemProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
}

const statusConfig = {
  queued: { icon: FileText, className: "text-muted" },
  uploading: { icon: Loader2, className: "animate-spin text-accent" },
  ready: { icon: CheckCircle2, className: "text-success" },
  error: { icon: AlertCircle, className: "text-danger" },
};

export function FileListItem({ file, onRemove }: FileListItemProps) {
  const { icon: Icon, className } = statusConfig[file.status];

  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-0">
      <Icon className={clsx("h-4 w-4 shrink-0", className)} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{file.name}</p>
        {file.error ? (
          <p className="truncate text-xs text-danger">{file.error}</p>
        ) : (
          <p className="truncate text-xs text-muted">{(file.size / 1024).toFixed(0)} KB</p>
        )}
      </div>
      <button onClick={() => onRemove(file.id)} className="shrink-0 rounded p-1 text-muted hover:bg-surface-hover hover:text-foreground" aria-label={`Remove ${file.name}`}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}