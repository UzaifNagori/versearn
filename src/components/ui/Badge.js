export default function Badge({ status }) {
  const config = {
    pending: { label: 'Pending', classes: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    completed: { label: 'Completed', classes: 'bg-green-500/20 text-green-400 border-green-500/30' },
    failed: { label: 'Failed', classes: 'bg-red-500/20 text-red-400 border-red-500/30' },
    approved: { label: 'Approved', classes: 'bg-green-500/20 text-green-400 border-green-500/30' },
    rejected: { label: 'Rejected', classes: 'bg-red-500/20 text-red-400 border-red-500/30' },
    active: { label: 'Active', classes: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    sold: { label: 'Sold', classes: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    banned: { label: 'Banned', classes: 'bg-red-500/20 text-red-400 border-red-500/30' },
  };

  const { label, classes } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
      {label}
    </span>
  );
}
