import { cn } from "@/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-2xl", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white/60 border border-forest/10 p-3">
      <Skeleton className="aspect-square w-full mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-3" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}
