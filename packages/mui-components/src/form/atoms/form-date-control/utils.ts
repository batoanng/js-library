import { parse } from 'date-fns';
import { DateControlFieldValueFormat, DateControlFieldValueFormats, DateControlFormValueFormat } from './types';

// Helper function to fix the casing for 'D', 'm', and 'Y' tokens in a format template
const fixFormatTemplate = (template: string) =>
  template.replace(/[DYm]/g, (char) => {
    switch (char) {
      case 'D':
      case 'Y':
        return char.toLowerCase();

      case 'm':
      default: // Only needed to prevent TS from complaining
        return char.toUpperCase();
    }
  });

export const getDateControlFieldValueFormat = (inputFormat?: DateControlFieldValueFormat | string | null) => {
  if (inputFormat == null) return 'dd/MM/yyyy';
  if (DateControlFieldValueFormats.includes(inputFormat as DateControlFieldValueFormat)) {
    return inputFormat as DateControlFieldValueFormat;
  }

  const result = fixFormatTemplate(inputFormat) as DateControlFieldValueFormat;
  if (DateControlFieldValueFormats.includes(result)) {
    return result;
  }

  const supportedFormats = DateControlFieldValueFormats.map((f) => `'${f}'`).join(', ');
  throw new Error(`Invalid date control input format '${inputFormat}'. The supported formats are: ${supportedFormats}`);
};

export const getDateControlFormValueFormat = (fieldFormat: DateControlFieldValueFormat) => {
  switch (fieldFormat) {
    case 'MM/yyyy':
      return 'yyyy-MM';

    case 'dd/MM/yyyy':
    default:
      return 'yyyy-MM-dd';
  }
};

export const getDateControlFieldValue = (
  formValue: Date | string | null,
  formValueFormat: DateControlFormValueFormat
) => {
  if (formValue == null) return null;
  return typeof formValue === 'string' ? parse(formValue, formValueFormat, new Date()) : formValue;
};
