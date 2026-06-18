import type { ExperimentStatus } from '../../data/experiments';

const STATUS_CONFIG: Record<
  ExperimentStatus,
  { emoji: string; label: string; className: string }
> = {
  success: { emoji: '✅', label: 'Success', className: 'status-badge--success' },
  failed: { emoji: '💀', label: 'Failed', className: 'status-badge--failed' },
  inconclusive: {
    emoji: '🤷',
    label: 'Inconclusive',
    className: 'status-badge--inconclusive',
  },
  'in-progress': {
    emoji: '🧪',
    label: 'In Progress',
    className: 'status-badge--in-progress',
  },
};

export function StatusBadge({ status }: { status: ExperimentStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`status-badge ${config.className}`}>
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
}
