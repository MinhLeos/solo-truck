import { forwardRef, useId, type InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  // Optional visible label — wraps the input in a <label> with a matched
  // id, since placeholder text alone disappears once typed and isn't a
  // substitute for a real accessible name.
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', label, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const input = (
    <input
      ref={ref}
      id={inputId}
      className={`w-full rounded-md border border-steel-deep bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus:border-flame focus:ring-2 focus:ring-flame/20 focus:outline-none ${className}`}
      {...props}
    />
  );

  if (!label) return input;

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1 text-sm text-ink">
      {label}
      {input}
    </label>
  );
});
