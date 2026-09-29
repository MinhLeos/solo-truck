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
      className={`w-full rounded-[10px] border border-[#cad7cf] bg-[#fbfcfb] px-[13px] py-3 text-sm text-[#18231f] placeholder:text-[#93a098] focus:border-[#52936e] focus:ring-3 focus:ring-[#52936e]/15 focus:outline-none ${className}`}
      {...props}
    />
  );

  if (!label) return input;

  return (
    <label htmlFor={inputId} className="flex flex-col gap-[7px] text-xs font-extrabold text-[#53645b]">
      {label}
      {input}
    </label>
  );
});
