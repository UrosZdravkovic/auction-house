interface StatCardProps {
  title: string;
  value: number;
  variant?: 'default' | 'warning' | 'success';
}

export const StatCard = ({ title, value, variant = 'default' }: StatCardProps) => {
  const colorClasses = {
    default: 'text-text-primary',
    warning: 'text-warning',
    success: 'text-success',
  };

  return (
    <div className="p-6 bg-surface rounded-lg border border-border">
      <div className="text-text-secondary text-sm mb-2">{title}</div>
      <div className={`text-3xl font-bold ${colorClasses[variant]}`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
};