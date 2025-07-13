import { TextInputProps } from '@/components';
import { FormFieldProps } from '@/types';
import type { SelectProps } from '@mui/material';
import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

export type DatePart = 'day' | 'month' | 'year';
export type DatePartOptionality = 'required' | 'optional' | 'hidden';

export type DatePartOptions = {
  /** Controls requirements for the 'Day' field. Defaults to 'required' */
  day?: DatePartOptionality;
  /** Controls requirements for the 'Month' field. Defaults to 'required' */
  month?: DatePartOptionality;
  /** Controls requirements for the 'Year' field. Defaults to 'required' */
  year?: DatePartOptionality;
};

export type DateInParts = {
  dayValue: string;
  monthValue: string;
  yearValue: string;
};

export type DatePartFieldInputProps = Omit<TextInputProps, 'id' | 'label' | 'onChange' | 'inputRef' | 'ref'>;
export type MonthSelectInputProps = Omit<SelectProps<string>, 'id' | 'label' | 'onChange' | 'inputRef' | 'ref'>;

export type FormDatePartsProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormFieldProps<TFieldValues, TName> & {
  label?: string;
  className?: string;
  datePartOptions?: DatePartOptions;
  helpMessage?: ReactNode;
  autoAdvance?: boolean;
  autoComplete?: string;
} & (
    | {
        showMonthNames?: false | undefined;
        inputProps?: {
          day?: DatePartFieldInputProps;
          month?: DatePartFieldInputProps;
          year?: DatePartFieldInputProps;
        };
      }
    | {
        showMonthNames: true;
        inputProps?: {
          day?: DatePartFieldInputProps;
          month?: MonthSelectInputProps;
          year?: DatePartFieldInputProps;
        };
      }
  );
