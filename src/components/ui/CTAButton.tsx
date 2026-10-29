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
    // Primary CTA: Blue Raspberry #006EE9 -> Night Skies #000181
    primary:
      'bg-[#006EE9] hover:bg-[#000181] text-white shadow-md shadow-[#006EE9]/25 active:scale-98 border border-transparent',
    // Hero CTA: Powdered Lime #D0FFA4 -> Sunny Skies #83E7FF, text #000181
    hero:
      'bg-[#D0FFA4] hover:bg-[#83E7FF] text-[#000181] shadow-lg shadow-[#000181]/15 active:scale-98 border border-transparent font-black',
    // Secondary: transparent, border 1.5px #000181, text #000181, hover #E8A0FF
    secondary:
      'bg-transparent hover:bg-[#E8A0FF] text-[#000181] shadow-xs active:scale-98 border-[1.5px] border-[#000181]',
    outline:
      'bg-white hover:bg-[#EFFBFF] text-[#000181] border border-[#E6E6EE] hover:border-[#83E7FF] shadow-xs active:scale-98',
    ghost:
      'bg-transparent hover:bg-[#EFFBFF] text-[#006EE9] hover:text-[#000181] border border-transparent',
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
