import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[#717182] mb-2">{title}</p>
            <p className="text-[#333333]">{value}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-[#6C63FF] to-[#FF6F91] rounded-lg flex items-center justify-center shadow-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
