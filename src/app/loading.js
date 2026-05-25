import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-[#9CA3AF] text-sm">Load ho raha hai...</p>
    </div>
  );
}
