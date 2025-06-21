import { FormErrorText } from '@/components';
import { render, screen } from '@/test-utils';

describe('FormErrorText', () => {
  it('should render snapshot', () => {
    const { container } = render(<FormErrorText>Error</FormErrorText>);

    expect(container).toMatchSnapshot();
  });

  it('should render successfully', () => {
    render(<FormErrorText>Error</FormErrorText>);
    const title = screen.getByText('Error');

    expect(title).toBeInTheDocument();
  });
});
