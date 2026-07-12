export function Skeleton({ className = "", variant = "text" }: { className?: string; variant?: "text" | "circular" | "rectangular" }) {
  const base = "animate-shimmer bg-primary-700/50";
  const shapes = {
    text: "h-4 w-full rounded-lg",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return <div className={`${base} ${shapes[variant]} ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-4">
      <Skeleton variant="rectangular" className="h-48 w-full" />
      <Skeleton className="w-3/4 h-5" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-1/2 h-4" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-card p-4 space-y-4">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="glass-card p-6 space-y-5">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-1/2" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-24" />
          ))}
        </div>
        <Skeleton variant="rectangular" className="h-64" />
      </div>
    </div>
  );
}
