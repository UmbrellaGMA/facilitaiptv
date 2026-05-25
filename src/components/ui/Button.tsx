import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'neon' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-none font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          {
            // Variants
            // Variants
            'bg-c6-gold text-black font-semibold hover:bg-c6-gold-hover': variant === 'primary',
            'bg-dark-border border border-dark-border/80 text-foreground hover:bg-dark-surface hover:text-c6-gold hover:border-c6-gold': variant === 'secondary',
            'bg-red-600 hover:bg-red-700 text-white': variant === 'danger',
            'bg-transparent border border-c6-gold/40 text-c6-gold hover:border-c6-gold hover:bg-c6-gold/5': variant === 'neon',
            'glass-panel text-white hover:bg-white/10 hover:border-white/20': variant === 'glass',
            'text-muted-foreground hover:text-foreground hover:bg-white/5': variant === 'ghost',
            
            // Sizes
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-base': size === 'md',
            'px-7 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
