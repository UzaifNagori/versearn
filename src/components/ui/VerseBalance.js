'use client';

export default function VerseBalance({ balance = 0, size = 'md' }) {
  const sizeClasses = {
    sm: { container: 'gap-1', coin: 'text-base', amount: 'text-sm font-semibold', label: 'text-xs' },
    md: { container: 'gap-2', coin: 'text-xl', amount: 'text-lg font-bold', label: 'text-sm' },
    lg: { container: 'gap-3', coin: 'text-3xl', amount: 'text-3xl font-bold', label: 'text-base' },
  };

  const classes = sizeClasses[size];
  const formatted = balance.toLocaleString('en-PK');

  return (
    <div className={`flex items-center ${classes.container}`}>
      <span className={classes.coin} role="img" aria-label="VERSE coin">⚡</span>
      <div>
        <span className={`${classes.amount} text-[#F59E0B]`}>{formatted}</span>
        <span className={`${classes.label} text-[#9CA3AF] ml-1`}>VERSE</span>
      </div>
    </div>
  );
}
