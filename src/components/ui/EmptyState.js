import Link from 'next/link';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#1A1A2E] border border-[#2D2D4E] flex items-center justify-center mb-4">
        {Icon && <Icon className="w-8 h-8 text-[#7C3AED]" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-[#9CA3AF] text-sm mb-6 max-w-sm">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-sm font-medium transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
