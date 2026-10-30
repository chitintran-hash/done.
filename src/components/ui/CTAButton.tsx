import React from 'react';

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'hero';
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
    // Primary CTA: Cobalt #3155FF -> Hover #2444DC, Active #1C35B8
    primary:
      'bg-[#3155FF] hover:bg-[#2444DC] active:bg-[#1C35B8] text-white shadow-md shadow-[#3155FF]/20 active:scale-98 border border-transparent',
    // Hero / Deal Highlight: Lime #C7F000 -> Hover #B6DC00, text #0C0D10
    hero:
      'bg-[#C7F000] hover:bg-[#B6DC00] text-[#0C0D10] shadow-md shadow-[#C7F000]/25 active:scale-98 border border-transparent font-black',
    // Secondary Button: white, border #3155FF, text #3155FF, hover bg #EEF1FF
    secondary:
      'bg-white hover:bg-[#EEF1FF] text-[#3155FF] shadow-xs active:scale-98 border-[1.5px] border-[#3155FF]',
    outline:
      'bg-white hover:bg-[#EEF1FF] text-[#0C0D10] border border-[#E4E8F0] hover:border-[#3155FF] shadow-xs active:scale-98',
    ghost:
      'bg-transparent hover:bg-[#EEF1FF] text-[#3155FF] hover:text-[#2444DC] border border-transparent',
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
