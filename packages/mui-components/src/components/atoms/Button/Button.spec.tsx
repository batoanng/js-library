import { ThemeProvider } from '@mui/material';

import { render, screen } from '@/test-utils';
import { defaultTheme } from '@/theme';

import { Button } from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Button</Button>);

    const button = screen.getByRole('button', { name: 'Button' });

    expect(button).toBeInTheDocument();
  });

  it('should render button with loading spinner and text when defined', () => {
    render(
      <ThemeProvider theme={defaultTheme}>
        <Button loading loadingText="Loading...">
          Button
        </Button>
      </ThemeProvider>
    );

    const loader = screen.getByTestId('loader');
    const loadingText = screen.getByText('Loading...');

    expect(loader).toBeInTheDocument();
    expect(loadingText).toBeInTheDocument();
  });
});
