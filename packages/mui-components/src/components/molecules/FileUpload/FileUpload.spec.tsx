import { Download } from '@mui/icons-material';
import { Link, ThemeProvider } from '@mui/material';

import { render, screen } from '@/test-utils';
import { defaultTheme } from '@/theme';

import { FileUpload } from './FileUpload';

vi.mock('@/hooks', async () => {
  const actual: Record<string, unknown> = await vi.importActual('@/hooks');

  return {
    ...actual,
    useScreenType: vi.fn(() => ({
      isMobile: true,
    })),
  };
});

describe('FileUpload', () => {
  const mockFunction = vi.fn();
  it('should render correctly', () => {
    render(
      <FileUpload
        id="file-upload"
        heading="File upload"
        legendText="legend text"
        files={[]}
        isLoading={false}
        onFileDelete={mockFunction}
        onFileUpload={mockFunction}
      />
    );

    expect(screen.getByText('File upload')).toBeInTheDocument();
    expect(screen.getByText('legend text')).toBeInTheDocument();

    expect(screen.getByText('Select File')).toBeInTheDocument();
  });

  it('should render correctly sub heading and sub text', () => {
    render(
      <FileUpload
        id="file-upload"
        heading="File upload"
        legendText="legend text"
        subHeading="sub heading"
        subText="sub text"
        files={[]}
        isLoading={false}
        onFileDelete={mockFunction}
        onFileUpload={mockFunction}
      />
    );

    expect(screen.getByText('File upload')).toBeInTheDocument();
    expect(screen.getByText('legend text')).toBeInTheDocument();

    expect(screen.getByText('Select File')).toBeInTheDocument();
    expect(screen.getByText('sub heading')).toBeInTheDocument();
    expect(screen.getByText('sub text')).toBeInTheDocument();
  });

  it('should render with initial file', () => {
    const file: File = new File(['test'], 'test-file.html', {
      type: 'text/html',
      lastModified: Date.now(),
    });
    render(
      <FileUpload
        id="file-upload"
        heading="File upload"
        legendText="legend text"
        files={[file]}
        isLoading={false}
        onFileDelete={mockFunction}
        onFileUpload={mockFunction}
      />
    );

    expect(screen.getByText('File upload')).toBeInTheDocument();
    expect(screen.getByText('test-file.html', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Remove file')).toBeInTheDocument();
  });

  it('should render with custom error message', () => {
    render(
      <FileUpload
        id="file-upload"
        heading="File upload"
        legendText="legend text"
        errorMessage="This is an error message"
        files={[]}
        isLoading={false}
        onFileDelete={mockFunction}
        onFileUpload={mockFunction}
      />
    );

    expect(screen.getByText('This is an error message')).toBeInTheDocument();
  });

  it('should render with link component', () => {
    render(
      <FileUpload
        id="file-upload"
        heading="File upload"
        legendText="legend text"
        files={[]}
        isLoading={false}
        linkSlot={
          <div>
            <Download name="download" style={{ marginRight: '8px', fill: '#2E5299' }} />
            <Link variant="body1" style={{ color: '#2E5299', textDecorationColor: '#2E5299' }}>
              link to template
            </Link>
          </div>
        }
        onFileDelete={mockFunction}
        onFileUpload={mockFunction}
      />
    );

    expect(screen.getByText('link to template')).toBeInTheDocument();
  });

  it('should render loading spinner when set to loading', () => {
    render(
      <ThemeProvider theme={defaultTheme}>
        <FileUpload
          id="file-upload"
          heading="File upload"
          legendText="legend text"
          files={[]}
          isLoading={true}
          onFileDelete={mockFunction}
          onFileUpload={mockFunction}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
