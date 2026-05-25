import Badge from './Badge';
import { Tv, ClipboardList, Footprints, Calendar, Users, ArrowDownToLine, Image, Coins } from 'lucide-react';

const typeConfig = {
  earn_ad: { icon: Tv, label: 'Ad Watch', color: '#7C3AED' },
  earn_survey: { icon: ClipboardList, label: 'Survey', color: '#3B82F6' },
  earn_walk: { icon: Footprints, label: 'Walk Earn', color: '#10B981' },
  earn_checkin: { icon: Calendar, label: 'Check-in', color: '#F59E0B' },
  earn_referral: { icon: Users, label: 'Referral', color: '#EC4899' },
  withdrawal: { icon: ArrowDownToLine, label: 'Withdrawal', color: '#EF4444' },
  nft_sale: { icon: Image, label: 'NFT Sale', color: '#10B981' },
  nft_purchase: { icon: Image, label: 'NFT Buy', color: '#EF4444' },
  nft_mint: { icon: Coins, label: 'NFT Mint', color: '#F59E0B' },
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function TransactionRow({ transaction }) {
  const { icon: Icon, label, color } = typeConfig[transaction.type] || typeConfig.earn_ad;
  const isPositive = transaction.amount > 0;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#2D2D4E] last:border-0">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + '20' }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{transaction.description}</p>
        <p className="text-xs text-[#9CA3AF]">{label} · {formatDate(transaction.created_at)}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`text-sm font-semibold ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {isPositive ? '+' : ''}{transaction.amount} VERSE
        </span>
        <Badge status={transaction.status} />
      </div>
    </div>
  );
}
