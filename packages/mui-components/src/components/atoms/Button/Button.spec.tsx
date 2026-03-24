import { render, screen } from '@/test-utils';

import { Button } from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Button</Button>);

    const button = screen.getByRole('button', { name: 'Button' });

    expect(button).toBeInTheDocument();
  });

  it('should render button with loading spinner and text when defined', () => {
    render(<Button loading loadingText="Loading...">Button</Button>);

    const loader = screen.getByTestId('loader');
    const loadingText = screen.getByText('Loading...');

    expect(loader).toBeInTheDocument();
    expect(loader.querySelector('circle')).toHaveAttribute('fill', 'currentColor');
    expect(loadingText).toBeInTheDocument();
  });
});
