import { useState } from 'react';

export interface FieldRule {
  id: string;
  label: string;
  value: string | number;
  email?: boolean;
  matches?: string;
}

export function validateFields(fields: FieldRule[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (!String(field.value).trim()) errors[field.id] = `${field.label} is required.`;
    else if (field.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(field.value).trim())) {
      errors[field.id] = 'Enter a valid email address.';
    } else if (field.matches !== undefined && field.value !== field.matches) {
      errors[field.id] = 'Passwords do not match.';
    }
  }
  return errors;
}

export default function useFieldValidation() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const clearField = (id: string) =>
    setFieldErrors(previous => {
      if (!previous[id]) return previous;
      const next = { ...previous };
      delete next[id];
      return next;
    });
  const validate = (fields: FieldRule[]) => {
    const errors = validateFields(fields);
    setFieldErrors(errors);
    const first = Object.keys(errors)[0];
    // Move focus first; setting errors afterwards keeps the new message visible.
    if (first) {
      document.getElementById(first)?.focus();
      setFieldErrors(errors);
    }
    return !first;
  };
  return { fieldErrors, clearField, clearFields: () => setFieldErrors({}), validate };
}
