import { ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { FormTextArea } from './FormTextArea';
import { defaultTheme } from '@/theme';

interface TestFormValues {
  value: string;
}

const TestHarness = ({ onChange, children }: PropsWithChildren<{ onChange?: (next: TestFormValues) => void }>) => {
  const form = useForm<TestFormValues>();
  form.watch((next) => onChange?.(next as TestFormValues));

  return (
    <ThemeProvider theme={defaultTheme}>
      <FormProvider {...form}>{children}</FormProvider>
    </ThemeProvider>
  );
};

describe('FormTextArea', () => {
  it('renders text area', async () => {
    const user = userEvent.setup();

    let text = '';
    const handleChange = ({ value }: TestFormValues) => (text = value);

    // act
    const { getByRole } = render(
      <TestHarness onChange={handleChange}>
        <FormTextArea name="value" label="Text area" />
      </TestHarness>
    );

    const expectedValue = 'this is text';
    await user.type(getByRole('textbox'), expectedValue);

    expect(text).toBe(expectedValue);
  });
});
