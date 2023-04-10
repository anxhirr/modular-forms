import {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormErrors,
} from '@modular-forms/shared';
import { ZodType } from 'zod';
import { DeepPartial, FieldValue } from '../types';

/**
 * Creates a validation functions that parses the Zod schema of a form.
 *
 * @param schema A Zod schema.
 *
 * @returns A validation function.
 */
export function zodForm<TFieldValues extends FieldValues<FieldValue>>(
  schema: ZodType<any, any, TFieldValues>
): (values: DeepPartial<TFieldValues>) => FormErrors<TFieldValues, FieldValue> {
  return (values: DeepPartial<TFieldValues>) => {
    const result = schema.safeParse(values);
    return result.success
      ? {}
      : result.error.issues.reduce<FormErrors<TFieldValues, FieldValue>>(
          (errors, error) => {
            const path = error.path.join('.') as
              | FieldPath<TFieldValues, FieldValue>
              | FieldArrayPath<TFieldValues, FieldValue>;
            if (!errors[path]) {
              errors[path] = error.message;
            }
            return errors;
          },
          {}
        );
  };
}
