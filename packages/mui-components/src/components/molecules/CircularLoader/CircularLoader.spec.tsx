import { render, screen } from '@/test-utils';

import { CircularLoader } from './CircularLoader';

describe('CircularLoader', () => {
  it('should render default text', () => {
    render(<CircularLoader />);
    const circularLoader = screen.getByText('One moment, please...');
    expect(circularLoader).toBeInTheDocument();
  });

  it('should render fullscreen loader', () => {
    render(<CircularLoader label="Loading..." fullScreen={true} />);
    const circularLoader = screen.getByText('Loading...');
    expect(circularLoader).toBeInTheDocument();

    expect(circularLoader).toHaveStyle('font-size: 1.75rem');
  });

  it('should inherit loader icon color from the theme', () => {
    render(<CircularLoader />);

    const loaderIcon = screen.getByTestId('circular-loader-icon');
    expect(loaderIcon.querySelector('circle')).toHaveAttribute('fill', 'currentColor');
  });
});
