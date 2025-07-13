import DownloadIcon from '@mui/icons-material/Download';
import { Box, Link, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { type DroppedFileRejection } from './types';

import { FileUpload } from './FileUpload';

export default {
  title: 'Components/Molecules/File Upload',
  decorators: [],
};

export const Default = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };
  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      files={files}
      isLoading={false}
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
    />
  );
};

export const Loading = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };
  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      files={files}
      isLoading={true}
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
    />
  );
};

export const AcceptedFileTypes = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };

  const handleRejections = (rejections: DroppedFileRejection[]) => {
    console.log({ rejections });
  };

  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      acceptedFormats={['image/jpeg', 'image/png']}
      files={files}
      isLoading={false}
      acceptedFormatsText="JPEG"
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
      onRejectedFilesChange={handleRejections}
    />
  );
};

export const MultipleFiles = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };

  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      maxFiles={3}
      maxTotalMBSize={4}
      files={files}
      isLoading={false}
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
    />
  );
};

export const CustomLegend = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };
  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      legendText="This is a bunch of custom text"
      files={files}
      isLoading={false}
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
    />
  );
};

export const MaximumFileSize = () => {
  const [files, setFiles] = useState<File[]>([]);
  const maxFileSizeInMb = 2;
  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };

  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      legendText={`Drag and drop files into this box or use the button to select and upload your files. File size must not exceed ${maxFileSizeInMb} MB.`}
      maxFileSize={maxFileSizeInMb}
      files={files}
      isLoading={false}
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
    />
  );
};

export const InitialFile = () => {
  const file: File = new File(['test'], 'test-file.jpg', {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });

  const [files, setFiles] = useState<File[]>([file]);
  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };

  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      files={files}
      isLoading={false}
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
    />
  );
};

export const ErrorMessage = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };

  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      errorMessage="This is an error message."
      files={files}
      isLoading={false}
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
    />
  );
};

export const SubHeading = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };
  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      subHeading="This is a sub heading"
      files={files}
      isLoading={false}
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
    />
  );
};

export const SubText = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };
  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      subText="This is sub text"
      files={files}
      isLoading={false}
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
    />
  );
};

export const LinkWithIcon = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };
  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      files={files}
      isLoading={false}
      linkSlot={
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <DownloadIcon name="download" style={{ marginRight: '8px', fill: '#2E5299' }} />
          <Link variant="body1" style={{ color: '#2E5299', textDecorationColor: '#2E5299' }}>
            link to template
          </Link>
        </div>
      }
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
    />
  );
};

export const CallingApi = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onFileDelete = (index: number) => {
    setIsLoading(true);

    // Simulating an example api call
    new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    }).then(() => {
      setIsLoading(false);
      setFiles((prevState) => prevState.filter((_, i) => i !== index));
    });
  };

  const onFileUpload = async (file: File[]) => {
    setIsLoading(true);

    // Simulating an example api call
    new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    }).then(() => {
      setIsLoading(false);
      setFiles((prevState) => [...prevState, ...file]);
    });
  };

  return (
    <FileUpload
      id="file-upload"
      heading="Upload your <document name>"
      maxFiles={3}
      files={files}
      isLoading={isLoading}
      onFileDelete={onFileDelete}
      onFileUpload={onFileUpload}
    />
  );
};

export const CompactVariant = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onFileDelete = (index: number) => {
    setFiles((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onFileUpload = async (file: File[]) => {
    setFiles((prevState) => [...prevState, ...file]);
  };
  return (
    <Stack>
      <Typography>Some form text</Typography>
      <Stack
        sx={{
          gap: 2,
        }}
      >
        <FileUpload
          id="file-upload"
          heading=""
          subHeading="File upload"
          subText="File must not exceed 5MB"
          maxFileSize={1}
          maxFiles={1}
          acceptedFormats={['image/jpeg', 'image/png', 'application/pdf']}
          files={files}
          isLoading={false}
          variant={'compact'}
          onFileDelete={onFileDelete}
          onFileUpload={onFileUpload}
        />
        <Box
          sx={{
            border: 'dotted',
          }}
        >
          This is a side box
        </Box>
      </Stack>
    </Stack>
  );
};
