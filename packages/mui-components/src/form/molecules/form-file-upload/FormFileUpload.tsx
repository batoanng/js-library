import { base64StringsToFiles, fileToBase64 } from './helpers';
import { type DroppedFileRejection, FileUpload, type FileUploadProps } from '@/components';
import { useState } from 'react';
import type { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { useDeleteFile, useSendFiles } from './hooks';
import type { FileUploadApi } from './types';
import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import { FormFieldProps } from '@/types';

export type FormFileUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormFieldProps<TFieldValues, TName> &
  Omit<FileUploadProps, 'onFileUpload' | 'onFileDelete' | 'files' | 'isLoading'> & {
    api?: FileUploadApi;
  };

export const FormFileUpload = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  id: suppliedId,
  name,
  rules,
  errorMode,
  shouldUnregister,
  api,
  /** Max file size in MB */
  maxFileSize,
  /** The number of files that a user is allowed to upload at once or a total number of files a user can upload.
      We only accept one file by default. */
  maxFiles,
  acceptedFormats,
  maxTotalMBSize,
  acceptedFormatsText,
  legendText,
  ...muiProps
}: FormFileUploadProps<TFieldValues, TName>) => {
  const id = useHtmlId('form-file-upload', suppliedId, name);

  const [apiError, setApiError] = useState('');
  const [rejectedFiles, setRejectedFiles] = useState<DroppedFileRejection[]>([]);
  const { isSendingFile, sendFiles } = useSendFiles({ onFailure: (error) => setApiError(error) });
  const { isDeletingFile, deleteFile } = useDeleteFile({ onFailure: (error) => setApiError(error) });

  const {
    field: { name: fieldName, onChange, value: formValue },
  } = useController<TFieldValues, TName>({
    name,
    rules: {
      ...(rules ?? {}),
      validate: {
        validFiles: () => (rejectedFiles.length ? 'You must dismiss the errors to continue.' : undefined),
        ...rules?.validate,
      },
    },
    shouldUnregister,
  });

  const handleFileChange = async (files: File[]) => {
    const newFiles = (formValue || []) as PathValue<TFieldValues, TName>[];
    if (api) {
      await sendFiles(api, files, newFiles);
    } else {
      const filePromises = files.map((file) => fileToBase64(file));

      const convertedFiles = await Promise.all(filePromises);

      (newFiles as string[]).push(...convertedFiles);
    }
    onChange(newFiles);
  };

  const handleFileDelete = async (index: number) => {
    const uploadedFiles = (formValue || []) as PathValue<TFieldValues, TName>[];

    if (api) {
      await deleteFile(api, index, uploadedFiles);
    }

    onChange(uploadedFiles.filter((_, i) => i !== index));
  };

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);

  return (
    <FileUpload
      {...muiProps}
      id={id}
      files={api ? formValue : base64StringsToFiles(formValue)}
      isLoading={isSendingFile || isDeletingFile}
      maxFileSize={maxFileSize}
      maxFiles={maxFiles}
      acceptedFormats={acceptedFormats}
      maxTotalMBSize={maxTotalMBSize}
      acceptedFormatsText={acceptedFormatsText}
      legendText={legendText}
      errorMessage={apiError || errorMessage}
      onFileUpload={handleFileChange}
      onFileDelete={handleFileDelete}
      onRejectedFilesChange={setRejectedFiles}
    />
  );
};
