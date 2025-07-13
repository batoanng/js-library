import { Button, Stack, Typography } from '@mui/material';
import type { FileRejection } from 'react-dropzone';

import { CircularLoader, Notification } from '@/components';

import { RemoveFileButton } from './RemoveFileButton';

const convertBytesToKiloBytes = (bytes: number) => {
  return (bytes / 1000).toFixed(2);
};

export interface FileUploadedProps {
  files: File[];
  onRemove: (index: number) => void;
  maxFiles: number;
  isLoading: boolean;
}

type File = {
  name: string;
  size: number;
};

export const FileUploaded = ({ files, onRemove, maxFiles, isLoading }: FileUploadedProps) => {
  if (!files.length) return null;

  const isExceededMaxFiles = maxFiles <= files.length;
  return (
    <>
      {isLoading && isExceededMaxFiles && (
        <Stack sx={{ position: 'relative', minHeight: (theme) => theme.spacing(6), width: '100%' }}>
          <CircularLoader label="Please wait..." />
        </Stack>
      )}
      {isExceededMaxFiles && (
        <Typography sx={{ my: 2 }}>
          To upload a different file, please remove one or more of the files below.
        </Typography>
      )}
      <Stack sx={{ mt: 2, gap: 0.5 }}>
        {files.map((file, index) => (
          <Stack
            key={index}
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              p: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Typography sx={{ pr: { xs: 1, md: 2 } }}>
              {file.name} ({convertBytesToKiloBytes(file.size)} KB)
            </Typography>
            <RemoveFileButton onRemove={() => onRemove(index)} />
          </Stack>
        ))}
      </Stack>
    </>
  );
};

export interface RejectedFilesProps {
  files: FileRejection[];
  onClear: () => void;
}

export const RejectedFiles = ({ files, onClear }: RejectedFilesProps) => {
  if (!files.length) return null;

  const errorMessages = Array.from(
    new Set<string>(files.flatMap((rejection) => rejection.errors).map(({ message }) => message))
  );

  const fileDescription = files.length !== 1 ? `${files.length} files were` : `A file was`;

  return (
    <Notification role="status" alertVariant="error" title={`${fileDescription} not uploaded`} sx={{ mt: 1 }}>
      <ul>
        {errorMessages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>

      <Button variant="text" color="secondary" sx={{ alignSelf: 'flex-start' }} onClick={onClear}>
        Dismiss
      </Button>
    </Notification>
  );
};
