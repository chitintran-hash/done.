import React from 'react';

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl font-bold gap-1.5',
    md: 'px-5 py-2.5 text-xs sm:text-sm rounded-xl font-extrabold gap-2',
    lg: 'px-6 py-3.5 text-sm sm:text-base rounded-2xl font-black gap-2.5 shadow-md',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#68415F] to-[#C77C86] hover:from-[#3A2438] hover:to-[#68415F] text-white shadow-md shadow-[#68415F]/25 active:scale-98 border border-[#68415F]/40',
    secondary:
      'bg-[#FFFCF8] hover:bg-[#FFF8F1] text-[#211A22] shadow-sm hover:shadow active:scale-98 border-2 border-[#211A22]',
    outline:
      'bg-[#FFFCF8] hover:bg-[#F2E8F0] text-[#352B32] border border-[#EADFE4] hover:border-[#D8CDD3] shadow-xs active:scale-98',
    ghost:
      'bg-transparent hover:bg-[#F2E8F0] text-[#68415F] hover:text-[#3A2438] border border-transparent',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 border border-rose-600',
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || typeof icon === 'object') {
      const IconComp = icon as React.ComponentType<{ className?: string }>;
      return <IconComp className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />;
    }
    return <>{icon}</>;
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{renderIcon()}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{renderIcon()}</span>}
    </button>
  );
};
