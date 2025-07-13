import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { SelectChangeEvent, SelectProps } from '@mui/material';
import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';

export type MonthFieldProps = Omit<SelectProps<string>, 'onChange'> & {
  error?: boolean;
  onChange: (next: string, part: 'month') => void;
};

const { format } = new Intl.DateTimeFormat('en-AU', { month: 'long' });
const MONTHS = [...new Array(12).keys()].map((monthIndex) => ({
  name: format(new Date(Date.UTC(2021, monthIndex))),
  value: (monthIndex + 1).toString().padStart(2, '0'),
}));

export const MonthSelect = forwardRef((props: MonthFieldProps, ref?: ForwardedRef<HTMLInputElement>) => {
  const { id, name, className = '', onChange, sx = {}, ...fieldProps } = props;

  const classNames = `date-part-field date-part-field-month ${className}`;
  const fieldId = `${id}_month`;
  const fieldName = `${name ?? id}_month`;

  const handleChange = (event: SelectChangeEvent<string>) => onChange(event.target.value, 'month');

  return (
    <FormControl fullWidth>
      <FormLabel sx={{ fontWeight: 'normal' }}>Month</FormLabel>
      <Select<string>
        displayEmpty
        id={fieldId}
        name={fieldName}
        label=""
        className={classNames}
        inputRef={ref}
        sx={{
          maxWidth: '10em',
          ...sx,
        }}
        IconComponent={KeyboardArrowDownIcon}
        onChange={handleChange}
        {...fieldProps}
      >
        {MONTHS.map(({ name, value }) => (
          <MenuItem key={name} value={value}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});
