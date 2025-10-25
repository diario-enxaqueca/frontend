import { Card, CardContent } from './ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
}

export function StatsCard({ title, value, subtitle, color = 'primary' }: StatsCardProps) {
  // Define cores baseadas na prop color
  const colorClasses = {
    primary: 'from-[#6C63FF] to-[#5850E6]',
    secondary: 'from-[#FF6F91] to-[#FF5577]',
    success: 'from-[#10B981] to-[#059669]',
    warning: 'from-[#F59E0B] to-[#D97706]',
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <p className="text-[#717182] mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[#333333]">{value}</p>
            {subtitle && (
              <span className="text-sm text-[#717182]">{subtitle}</span>
            )}
          </div>
        </div>
        <div className={`mt-4 h-2 bg-gradient-to-r ${colorClasses[color]} rounded-full`} />
      </CardContent>
    </Card>
  );
}