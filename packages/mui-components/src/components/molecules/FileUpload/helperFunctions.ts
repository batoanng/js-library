import type { Theme } from '@mui/material';
import type { Accept, FileError } from 'react-dropzone';

import { ErrorCode } from './types';

// give a list of mime types as an array of strings
// return an object with the mime types as keys and the file extensions as values
// e.g. { 'image/jpeg': ['jpg', 'png'], 'image/png': ['png', 'png'] }
export const getMimeTypes = (acceptedFormats: string[]): Accept => {
  const mimeTypes: Record<string, string[]> = {};

  acceptedFormats.forEach((format) => {
    const fileExtension = `.${format.split('/')[1]}`;
    if (mimeTypes[format]) {
      mimeTypes[format].push(fileExtension);
    } else {
      mimeTypes[format] = [fileExtension];
    }
  });

  const acceptedMimeTypes: Accept = mimeTypes;

  return acceptedMimeTypes;
};

export const getErrorMessage = (
  errorCode: FileError['code'],
  maxFiles: number,
  maxFileSize: number,
  acceptedFormatsText?: string
) => {
  switch (errorCode) {
    case ErrorCode.TooManyFiles:
      return `You can only upload a maximum of ${maxFiles} document${maxFiles > 1 ? 's' : ''}.`;

    case ErrorCode.FileTooLarge:
      return `Files must be less than ${maxFileSize} MB.`;

    case ErrorCode.FileInvalidType:
      return acceptedFormatsText ? `Files must be ${acceptedFormatsText}.` : 'Unsupported file extension.';

    case ErrorCode.TotalFilesTooLarge:
      return `Combined file size limit reached.`;

    default:
      return '';
  }
};

export const getLegendText = (isMobile: boolean, maxFileSize: number, acceptedFormatsText?: string): string[] => {
  const acceptedFormats = acceptedFormatsText || 'PDF, JPG, PNG';
  if (isMobile) {
    return [`Upload your files. Formats accepted: ${acceptedFormats}. File size must not exceed ${maxFileSize} MB.`];
  }

  return [
    `Drag and drop files into this box or use the button to select and upload your files.`,
    `Formats accepted: ${acceptedFormats}.`,
    `Each file must be less than ${maxFileSize} MB.`,
  ];
};

export const getBorderColour = (theme: Theme, hasError: boolean) => {
  return hasError ? theme.palette.error.main : theme.palette.text.primary;
};

export type ValidateFileArgs = {
  file: File;
  maxFiles: number;
  maxFileSize: number;
  hasExceededMaxFiles: boolean;
  hasExceededMaxCombinedSize: (file: File) => boolean;
  acceptedFormats: string[];
  maxSizeInBytes: number;
  acceptedFormatsText?: string;
};

export const validateFile = ({
  file,
  maxFiles,
  maxFileSize,
  hasExceededMaxFiles,
  hasExceededMaxCombinedSize,
  acceptedFormats,
  acceptedFormatsText,
  maxSizeInBytes,
}: ValidateFileArgs): FileError | FileError[] | null => {
  const validationErrors = [...validate()];

  if (!validationErrors.length) return null;
  return validationErrors.length > 1 ? validationErrors : validationErrors[0];

  //////////

  function* validate() {
    if (hasExceededMaxFiles) {
      yield {
        code: ErrorCode.TooManyFiles,
        message: getErrorMessage(ErrorCode.TooManyFiles, maxFiles, maxFileSize),
      };
    }

    if (hasExceededMaxCombinedSize(file)) {
      yield {
        code: ErrorCode.TotalFilesTooLarge,
        message: getErrorMessage(ErrorCode.TotalFilesTooLarge, maxFiles, maxFileSize),
      };
    }

    if (acceptedFormats.length && !acceptedFormats.includes(file.type)) {
      yield {
        code: ErrorCode.FileInvalidType,
        message: getErrorMessage(ErrorCode.FileInvalidType, maxFiles, maxFileSize, acceptedFormatsText),
      };
    }

    if (file.size > maxSizeInBytes) {
      yield {
        code: ErrorCode.FileTooLarge,
        message: getErrorMessage(ErrorCode.FileTooLarge, maxFiles, maxFileSize),
      };
    }
  }
};
