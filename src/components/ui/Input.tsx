import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`px-4 py-2.5 bg-slate-50/50 border border-slate-200 focus:border-brand-indigo/60 focus:bg-white rounded-xl text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-indigo/5 placeholder:text-slate-600 ${
            error ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500 mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
