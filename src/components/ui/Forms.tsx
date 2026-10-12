'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-gray-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[#055838] focus:border-transparent',
              leftIcon && 'pl-10',
              error ? 'border-rose-300 focus:ring-rose-500' : 'border-gray-300 hover:border-gray-400',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-gray-500">{helperText}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: { value: string | number; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-gray-700">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={clsx(
            'w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-gray-900 transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#055838] focus:border-transparent',
            error ? 'border-rose-300 focus:ring-rose-500' : 'border-gray-300 hover:border-gray-400',
            className
          )}
          {...props}
        >
          {options ? options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )) : children}
        </select>
        {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-gray-500">{helperText}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, rows = 3, ...props }, ref) => {
    const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={areaId} className="text-xs font-semibold uppercase tracking-wider text-gray-700">
            {label}
          </label>
        )}
        <textarea
          id={areaId}
          ref={ref}
          rows={rows}
          className={clsx(
            'w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#055838] focus:border-transparent',
            error ? 'border-rose-300 focus:ring-rose-500' : 'border-gray-300 hover:border-gray-400',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-gray-500">{helperText}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
