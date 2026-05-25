export default function StatCard({ title, value, icon: Icon, change, color = '#7C3AED' }) {
  return (
    <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5 shadow-lg shadow-purple-900/20">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[#9CA3AF] text-sm font-medium">{title}</p>
        {Icon && (
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: color + '20' }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {change !== undefined && change !== null && (
        <p className={`text-xs mt-1 ${change >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% aaj
        </p>
      )}
    </div>
  );
}
