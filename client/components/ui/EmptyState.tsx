import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-10 text-center">
      <Icon className="h-6 w-6 text-muted" />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted">{description}</p>
    </div>
  );
}