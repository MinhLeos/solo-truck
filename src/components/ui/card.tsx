import { type HTMLAttributes } from 'react';

export function Card({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[14px] border border-[#dce4de] bg-white px-5 py-[18px] shadow-[0_5px_18px_#17352a08] ${className}`}
      {...props}
    />
  );
}
