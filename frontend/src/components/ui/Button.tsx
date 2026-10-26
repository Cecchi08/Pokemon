import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return <button className={`ui-button ui-button-${variant} ${className}`} {...props} />;
}