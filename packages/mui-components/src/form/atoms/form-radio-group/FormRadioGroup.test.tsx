import type { FormOption } from '@/types';
import { ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { FormRadioGroup } from './FormRadioGroup';
import { defaultTheme } from '@/theme';

interface TestFormValues {
  value: string;
}

const NUMBER_OPTIONS: FormOption<number, string>[] = [
  { value: 1, label: 'One' },
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' },
  { value: 4, label: 'Four' },
  { value: 5, label: 'Five' },
  { value: 6, label: 'Six' },
  { value: 7, label: 'Seven' },
  { value: 8, label: 'Eight' },
];

const TestHarness = ({ children }: PropsWithChildren) => {
  const form = useForm<TestFormValues>();

  return (
    <ThemeProvider theme={defaultTheme}>
      <FormProvider {...form}>{children}</FormProvider>
    </ThemeProvider>
  );
};

describe('FormRadioGroup', () => {
  it('renders radio buttons when there are less options than the default threshold', async () => {
    // arrange

    const options: FormOption<number, string>[] = [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
    ];

    // act
    const { getByLabelText } = render(
      <TestHarness>
        <FormRadioGroup<FormOption<number>> name="value" label="Radio buttons" options={options} />
      </TestHarness>
    );

    // assert
    options.forEach((option) => {
      const radioButton = getByLabelText(option.label);
      expect(radioButton).toBeInstanceOf(HTMLInputElement);
    });
  });

  it('passes the selected value when a radio button is clicked', async () => {
    // arrange
    const options = NUMBER_OPTIONS.slice(0, 3);
    const optionToSelect = options[1];

    const user = userEvent.setup();

    // act
    const { getByLabelText } = render(
      <TestHarness>
        <FormRadioGroup<FormOption<number>> name="value" label="Radio buttons" options={options} />
      </TestHarness>
    );

    await user.click(getByLabelText(optionToSelect.label));

    // assert
    const radioButton = getByLabelText(optionToSelect.label) as HTMLInputElement;
    expect(radioButton.checked).toBe(true);
  });
});
