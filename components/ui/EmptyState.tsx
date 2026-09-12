import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { ButtonLink } from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-20 px-6">
      <div className="w-20 h-20 rounded-3xl bg-forest/8 flex items-center justify-center mx-auto mb-6">
        <Icon size={32} className="text-forest/40" />
      </div>
      <h3 className="font-display font-bold text-xl text-forest-deep mb-2">
        {title}
      </h3>
      <p className="text-forest-deep/55 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <ButtonLink href={actionHref}>{actionLabel}</ButtonLink>
      )}
    </div>
  );
}
