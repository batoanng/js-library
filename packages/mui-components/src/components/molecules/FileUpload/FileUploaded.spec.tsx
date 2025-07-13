import { fireEvent, render, screen } from '@/test-utils';

import { FileUploaded } from './FileUploaded';

describe('FileUploaded', () => {
  it('should render the component with the max file text when files uploaded are equal to max file numbe', () => {
    const files = [
      {
        name: 'test.pdf',
        size: 1000,
      },
    ];

    render(<FileUploaded files={files} maxFiles={1} isLoading={false} onRemove={vi.fn()} />);

    expect(
      screen.getByText('To upload a different file, please remove one or more of the files below.')
    ).toBeInTheDocument();
  });

  it('should not render the max file text when max file number is not reached', () => {
    const files = [
      {
        name: 'test.pdf',
        size: 1000,
      },
    ];

    render(<FileUploaded files={files} maxFiles={2} isLoading={false} onRemove={vi.fn()} />);

    expect(
      screen.queryByText('To upload a different file, please remove one or more of the files below.')
    ).not.toBeInTheDocument();
  });

  it('should render files', () => {
    const files = [
      {
        name: 'test.pdf',
        size: 1000,
      },
      {
        name: 'test2.pdf',
        size: 2000,
      },
    ];
    render(<FileUploaded files={files} maxFiles={1} isLoading={false} onRemove={vi.fn()} />);

    expect(
      screen.getByText('test.pdf', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText('1.00', {
        exact: false,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('test2.pdf', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText('2.00', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('should remove file', () => {
    const mockedRemoveFunction = vi.fn();
    const files = [
      {
        name: 'test.pdf',
        size: 1000,
      },
    ];
    render(<FileUploaded files={files} maxFiles={1} isLoading={false} onRemove={mockedRemoveFunction} />);

    const removeButton = screen.getByRole('button');

    expect(removeButton).toBeInTheDocument();

    fireEvent.click(removeButton);

    expect(mockedRemoveFunction).toHaveBeenCalledTimes(1);
  });

  it('should render the component with the loading spinner when set to loading', () => {
    const files = [
      {
        name: 'test.pdf',
        size: 1000,
      },
    ];

    render(<FileUploaded files={files} maxFiles={1} isLoading={true} onRemove={vi.fn()} />);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });
});
