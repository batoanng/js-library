import userEvent from '@testing-library/user-event';

import { render, screen } from '@/test-utils';

import { IconModal } from './IconModal';

describe('ConfirmationPageButtons', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render the info icon', () => {
    render(<IconModal title="Tooltip tile" />);

    expect(screen.getByTestId('InfoRoundedIcon')).toBeInTheDocument();
  });

  it('should render the help icon', () => {
    render(<IconModal title="Tooltip tile" iconType="help" />);

    expect(screen.getByTestId('HelpIcon')).toBeInTheDocument();
  });

  it('should open the slide modal upon clicking the tooltip button', async () => {
    render(<IconModal title="Tooltip tile" subtext="Tooltip subtext" helpText="Tooltip help message" />);

    const user = userEvent.setup();

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Tooltip tile')).toBeInTheDocument();
    expect(screen.getByText('Tooltip subtext')).toBeInTheDocument();
    expect(screen.getByText('Tooltip help message')).toBeInTheDocument();
    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
  });
});
