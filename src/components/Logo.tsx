import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl md:text-4xl',
};

export default function Logo({ size = 'sm', className }: LogoProps) {
  return (
    <span className={cn('font-bold tracking-tight', sizeClasses[size], className)}>
      <span className="text-[#EF4444]">Go</span>
      <span className="text-foreground">Civique</span>
    </span>
  );
}
