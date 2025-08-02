'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MyButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const MyButton = React.forwardRef<HTMLDivElement, MyButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          },
          // Sizes
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

MyButton.displayName = 'MyButton';

export { MyButton };
