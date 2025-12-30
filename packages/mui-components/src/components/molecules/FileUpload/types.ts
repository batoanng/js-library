import type { ReactNode } from 'react';
import type { FileRejection } from 'react-dropzone';

export interface FileUploadProps {
  id?: string;
  name?: string;
  heading?: string;
  subHeading?: ReactNode;
  subText?: ReactNode;
  promptText?: ReactNode;
  linkSlot?: ReactNode;
  legendText?: string;
  onFileUpload: (files: File[]) => Promise<void>;
  onRejectedFilesChange?: (rejectedFiles: FileRejection[]) => void;
  onFileDelete: (index: number) => void;
  isLoading: boolean;
  errorMessage?: string;
  files: File[];
  maxFiles?: number;
  maxFileSize?: number;
  maxTotalMBSize?: number;
  acceptedFormats?: string[];
  acceptedFormatsText?: string;
  variant?: FileUploadVariant;
  themeLegendText?: string[];
}

export type FileUploadVariant = 'compact' | 'default';

export enum ErrorCode {
  FileInvalidType = 'file-invalid-type',
  FileTooLarge = 'file-too-large',
  FileTooSmall = 'file-too-small',
  TooManyFiles = 'too-many-files',
  TotalFilesTooLarge = 'total-files-too-large',
}

export type DroppedFileRejection = FileRejection;
