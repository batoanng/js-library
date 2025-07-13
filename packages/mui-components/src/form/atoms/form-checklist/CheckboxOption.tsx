import { CheckRounded } from '@mui/icons-material';
import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import { ReactNode } from 'react';

export const getId = (id: string, component: string) => `${id}-${component}`;

export interface CheckboxOptionsProps<TValue> {
  id: string;
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
  helpMessage: ReactNode;
  label: ReactNode;
  value: TValue;
}

export const CheckboxOption = <TValue,>({
  disabled,
  id,
  checked,
  label,
  value,
  onChange,
  helpMessage,
}: CheckboxOptionsProps<TValue>) => {
  return (
    <FormControlLabel
      value={value}
      disabled={disabled}
      control={
        <Checkbox id={id} icon={<span className="unchecked-box" />} checkedIcon={<CheckRounded />} checked={checked} />
      }
      label={
        <>
          {label}
          {helpMessage && (
            <FormHelperText id={getId(id, 'helper-text')} component="span" sx={{ pt: 0 }}>
              {helpMessage}
            </FormHelperText>
          )}
        </>
      }
      sx={{ '& .MuiFormControlLabel-label': { pt: 0.5, pb: helpMessage ? 0 : 0.5 } }}
      onChange={onChange}
    />
  );
};
