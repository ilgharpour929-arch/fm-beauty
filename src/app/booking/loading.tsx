import { FormSkeleton } from "@/components/ui/Skeleton";

export default function BookingLoading() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="h-8 w-1/3 animate-shimmer bg-primary-700/50 rounded-lg mx-auto" />
          <div className="h-5 w-1/4 animate-shimmer bg-primary-700/50 rounded-lg mx-auto mt-2" />
        </div>
        <FormSkeleton />
      </div>
    </div>
  );
}
