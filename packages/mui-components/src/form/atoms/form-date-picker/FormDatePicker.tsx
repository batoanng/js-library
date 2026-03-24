import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { FormControl, FormHelperText, FormLabel, type SxProps, type Theme } from '@mui/material';
import type { DatePickerProps } from '@mui/x-date-pickers';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import {
  FormDateControlProps,
  getDateControlFieldValue,
  getDateControlFieldValueFormat,
  getDateControlFormValueFormat,
  useDateControlFormEventHandlers,
  useDateControlRules,
} from '@/form';
import { InputWidthVariant, getMaxWidth } from '@/functions';
import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import { FormErrorText } from '@/components';

const calendarIconStyling = (theme: Theme): SxProps<Theme> => {
  return {
    'backgroundColor': theme.palette.background.paper,
    'borderRadius': 0,
    'height': '100%',
    'width': '3rem',
    'marginRight': '-14px', // Readjusting the spacing added from the base InputBase

    '& svg': {
      fontSize: '1.2rem',
      fill: theme.palette.secondary.main,
    },
  };
};

export type FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormDateControlProps<TFieldValues, TName> &
  Omit<DatePickerProps<Date>, 'format' | 'margin' | 'focused' | 'hiddenLabel' | 'optional' | 'value'> & {
    required?: boolean;
    placeholder?: string;
    inputWidth?: InputWidthVariant;
  };

export const FormDatePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: FormDatePickerProps<TFieldValues, TName>
) => {
  const {
    id: suppliedId,
    name,
    label,
    helpMessage = 'Use format DD/MM/YYYY',
    required = false,
    errorMode,
    rules: suppliedRules,
    shouldUnregister,
    inputFormat: suppliedInputFormat = 'dd/MM/yyyy',
    minDate,
    maxDate,
    errorMessages,
    sx = {},
    placeholder = '',
    inputWidth,
    ...inputProps
  } = props;

  const fieldValueFormat = getDateControlFieldValueFormat(suppliedInputFormat);
  const formValueFormat = getDateControlFormValueFormat(fieldValueFormat);

  const rules = useDateControlRules(
    suppliedRules,
    required,
    minDate,
    maxDate,
    fieldValueFormat,
    formValueFormat,
    errorMessages
  );

  const id = useHtmlId('form-date-picker', suppliedId, name);

  const {
    field: { ref, name: fieldName, value: formValue, onChange, onBlur },
    fieldState,
  } = useController({
    name,
    rules,
    shouldUnregister,
  });

  const fieldValue = getDateControlFieldValue(formValue, formValueFormat);
  const { handleChange, handleBlur } = useDateControlFormEventHandlers(formValueFormat, onChange, onBlur);

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);
  const hasError = fieldState.error != null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl error={hasError}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <FormHelperText component={'span'}>{helpMessage}</FormHelperText>
        <DatePicker
          {...inputProps}
          value={fieldValue}
          format={fieldValueFormat}
          minDate={minDate}
          maxDate={maxDate}
          sx={{
            'maxWidth': inputWidth ? getMaxWidth(inputWidth) : '26rem',
            '& .MuiInputAdornment-root': { height: '100%', maxHeight: '100%' },
            ...sx,
          }}
          slots={{ openPickerIcon: CalendarTodayOutlinedIcon }}
          slotProps={{
            textField: {
              id,
              name: fieldName,
              error: hasError,
              onBlur: handleBlur,
              placeholder,
            },
            popper: {
              placement: 'bottom-end',
            },
            openPickerButton: {
              disableRipple: true,
              sx: (theme) => ({
                ...calendarIconStyling(theme),
              }),
            },
          }}
          inputRef={ref}
          onChange={handleChange}
        />
        {hasError ? <FormErrorText>{errorMessage}</FormErrorText> : null}
      </FormControl>
    </LocalizationProvider>
  );
};
