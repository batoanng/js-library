import type { IconModalProps } from '@/components';
import { FormErrorText, IconModal } from '@/components';
import { InputWidthVariant } from '@/functions';
import { useHtmlId } from '@/hooks';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { TimePicker as MuiTimePicker, type TimePickerProps as MuiTimePickerProps } from '@mui/x-date-pickers';
import { forwardRef, type ReactNode } from 'react';

export type TimePickerProps = MuiTimePickerProps<Date, true> & {
  id?: string;
  label: ReactNode;
  helpMessage?: ReactNode;
  value: Date | null;
  onChange: (nextValue: Date | null) => void;
  error?: boolean;
  errorMessage?: ReactNode;
  inputWidth?: InputWidthVariant;
  infoTooltipProps?: IconModalProps;
};

const TimePickerLabel = ({
  label,
  helpMessage,
  infoTooltipProps,
}: Pick<TimePickerProps, 'label' | 'helpMessage' | 'infoTooltipProps'>) => {
  if (helpMessage) return <>{label}</>;

  return (
    <>
      {label}
      {Boolean(infoTooltipProps) && <IconModal {...infoTooltipProps!} />}
    </>
  );
};

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>((props, ref) => {
  const {
    id: suppliedId,
    name,
    label,
    helpMessage,
    error = false,
    errorMessage,
    infoTooltipProps,

    // All these properties get promoted to the `FormControl` then inherited by the `TimePicker`. We are mimicking what the
    // MUI TextField does; see: https://github.com/mui/material-ui/blob/master/packages/mui-material/src/TextField/TextField.js#L154
    className,
    disabled,
    sx,

    // The rest go to the input component
    ...inputProps
  } = props;

  const id = useHtmlId('time-picker', suppliedId, name);

  return (
    <FormControl ref={ref} className={className} disabled={disabled} error={error} variant="outlined" sx={sx}>
      <FormLabel htmlFor={id}>
        <TimePickerLabel label={label} helpMessage={helpMessage} infoTooltipProps={infoTooltipProps} />
      </FormLabel>
      {helpMessage && (
        <FormHelperText id={`${id}-helper-text`} component="span">
          {helpMessage}
          {Boolean(infoTooltipProps) && <IconModal {...infoTooltipProps!} />}
        </FormHelperText>
      )}
      <MuiTimePicker label="" {...inputProps} />
      {errorMessage && <FormErrorText>{errorMessage}</FormErrorText>}
    </FormControl>
  );
});
