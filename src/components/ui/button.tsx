import { type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-[#1d6b45] text-white hover:bg-[#175a3a]',
  secondary: 'bg-[#e9efeb] text-[#31503f] hover:bg-[#dde7e1]',
  ghost: 'text-[#557164] hover:bg-[#edf1ee]',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-[10px] px-4 py-3 text-[.82rem] font-extrabold transition-colors disabled:pointer-events-none disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
