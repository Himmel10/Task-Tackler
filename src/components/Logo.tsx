import { CheckCircle2 } from 'lucide-react';

export const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-yellow-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg`}>
      <CheckCircle2 className="w-full h-full text-white p-1" strokeWidth={2.5} />
    </div>
  );
};
