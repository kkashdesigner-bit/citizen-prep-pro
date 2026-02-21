import { cn } from '@/lib/utils';
import logoImg from '@/assets/logo.svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-10 md:h-12 w-auto',
  md: 'h-16 md:h-20 w-auto',
  lg: 'h-32 md:h-48 w-auto',
};

export default function Logo({ size = 'sm', className }: LogoProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <img
        src={logoImg}
        alt="GoCivique Logo"
        className={cn('object-contain rounded-md', sizeClasses[size])}
      />
    </div>
  );
}
