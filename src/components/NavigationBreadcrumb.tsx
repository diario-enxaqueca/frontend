import { ChevronRight, Home } from 'lucide-react';
import { Button } from './ui/button';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface NavigationBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function NavigationBreadcrumb({ items }: NavigationBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-[#717182]" />
              )}
              {item.onClick && !isLast ? (
                <Button
                  variant="link"
                  onClick={item.onClick}
                  className="text-[#6C63FF] hover:text-[#5850E6] p-0 h-auto"
                >
                  {item.label}
                </Button>
              ) : (
                <span className={isLast ? 'text-[#333333]' : 'text-[#717182]'}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
