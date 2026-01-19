import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  required = false,
  children,
  hint,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
        'aria-required': required,
      })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
