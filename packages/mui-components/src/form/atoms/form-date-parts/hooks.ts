import { useCallback, useMemo } from 'react';

import type { DateInParts, DatePartOptionality, DatePartOptions } from './types';

const DATE_PARTS_DEFAULT: Required<DatePartOptions> = {
  day: 'required',
  month: 'required',
  year: 'required',
};

/**
 * Hook to validate the date part options are valid.
 *
 * @param options The options to validate.
 * @returns A valid set of date part options.
 */
export const useDatePartOptions = (options: DatePartOptions = DATE_PARTS_DEFAULT): Required<DatePartOptions> => {
  const { day, month, year } = options;

  return useMemo(() => {
    const d = day ?? DATE_PARTS_DEFAULT.day;
    const m = month ?? DATE_PARTS_DEFAULT.month;
    const y = year ?? DATE_PARTS_DEFAULT.year;

    const isValid =
      (m === 'required' && (d === 'required' || y === 'required')) || // Allows for full or two-part partial dates
      (m !== 'hidden' && y === 'required'); // Allow for partial dates of year only

    const result = { day: d, month: m, year: y };
    if (isValid) return result;

    console.warn('Invalid date part options', result, 'Assuming all fields are required.');
    return DATE_PARTS_DEFAULT;
  }, [day, month, year]);
};

/**
 * Parses a three-part date value to determine the day/month/year parts.
 *
 * @param datePartOptions The optionality of the date parts
 */
export const useValueParser = (datePartOptions: Required<DatePartOptions>) => {
  const { day, month, year } = datePartOptions;

  return useCallback(
    (value?: string): DateInParts => {
      let dayValue = '',
        monthValue = '',
        yearValue = '';

      if (value != null && value !== '') {
        const parts = value.split('-');

        if (parts.length === 1) {
          [yearValue] = parts;
        } else if (parts.length === 3 || (day === 'required' && month === 'required' && year === 'required')) {
          [yearValue, monthValue, dayValue] = parts;
        } else if (day !== 'required') {
          [yearValue, monthValue] = parts;
        } else {
          [monthValue, dayValue] = parts;
        }
      }

      return { dayValue, monthValue, yearValue };
    },
    [day, month, year]
  );
};

/**
 * Formats date parts into an ISO8601 date string, based on the optionality of each date part.
 *
 * @param datePartOptions The optionality of the date parts
 */
export const useValueFormatter = (datePartOptions: Required<DatePartOptions>) => {
  const { day, month, year } = datePartOptions;

  return useCallback(
    ({ dayValue, monthValue, yearValue }: DateInParts) => {
      const result = [];

      const shouldUseValue = (part: DatePartOptionality, value?: string) => {
        if (part === 'required') return true;
        if (part === 'hidden') return false;

        return typeof value === 'string' && value.trim() !== '';
      };

      if (shouldUseValue(day, dayValue)) result.push(dayValue);
      // If there's a day value, then we have to use the month value too.
      if (result.length || shouldUseValue(month, monthValue)) result.push(monthValue);
      if (shouldUseValue(year, yearValue)) result.push(yearValue);

      return result.reverse().join('-');
    },
    [day, month, year]
  );
};
