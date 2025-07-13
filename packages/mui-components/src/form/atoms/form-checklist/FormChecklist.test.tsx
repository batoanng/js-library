import { ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { FormOption } from '@/types';
import { FormChecklist } from './FormChecklist';
import { defaultTheme } from '@/theme';

interface TestFormValues {
  value: number[];
}

const TestHarness = ({ children }: PropsWithChildren) => {
  const form = useForm<TestFormValues>();

  return (
    <ThemeProvider theme={defaultTheme}>
      <FormProvider {...form}>{children}</FormProvider>
    </ThemeProvider>
  );
};

const NO_OP = () => void +1;

type Option<TValue> = FormOption<TValue>;
type Options<TValue> = Option<TValue>[];

describe('FormChecklist', () => {
  it('renders checkbox', async () => {
    // arrange
    const options: Options<number> = [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
    ];

    // act
    const { getByLabelText } = render(
      <TestHarness>
        <FormChecklist<TestFormValues, 'value'> name="value" label="Checkbox" options={options} onChange={NO_OP} />
      </TestHarness>
    );

    // assert
    options.forEach((option) => {
      const checkBox = getByLabelText(option.label);
      expect(checkBox).toBeInstanceOf(HTMLInputElement);
    });
  });

  it('renders checkbox shows help message', async () => {
    // arrange
    const options: Options<number> = [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
    ];

    // act
    const { getByText } = render(
      <TestHarness>
        <FormChecklist<TestFormValues, 'value'>
          name="value"
          label="Checkbox"
          options={options}
          helpMessage="Help message"
          onChange={NO_OP}
        />
      </TestHarness>
    );

    // assert
    expect(getByText('Help message')).toBeInTheDocument();
  });

  it('renders checkbox disabled', async () => {
    // arrange
    const options: Options<number> = [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
    ];

    // act
    const { getByText } = render(
      <TestHarness>
        <FormChecklist<TestFormValues, 'value'>
          name="value"
          label="Checkbox"
          options={options}
          helpMessage="Help message"
          onChange={NO_OP}
        />
      </TestHarness>
    );

    // assert
    expect(getByText('Help message')).toBeInTheDocument();
  });

  it('renders checkbox, then clicks on box', async () => {
    // arrange
    const options: Options<number> = [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
    ];
    const optionToSelect = options[0];

    const onChange = vi.fn();

    const user = userEvent.setup();

    // act
    const { getByLabelText } = render(
      <TestHarness>
        <FormChecklist<TestFormValues, 'value'> name="value" label="Checkbox" options={options} onChange={onChange} />
      </TestHarness>
    );

    await user.click(getByLabelText(optionToSelect.label));

    // assert
    const checkbox = getByLabelText(optionToSelect.label) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
