import { FormErrorText } from '@/components';
import { render, screen } from '@/test-utils';

describe('FormErrorText', () => {
  it('should render the error icon', () => {
    render(<FormErrorText>Error</FormErrorText>);

    expect(screen.getByTestId('ErrorIcon')).toBeInTheDocument();
  });

  it('should render successfully', () => {
    render(<FormErrorText>Error</FormErrorText>);
    const title = screen.getByText('Error');

    expect(title).toBeInTheDocument();
  });
});
