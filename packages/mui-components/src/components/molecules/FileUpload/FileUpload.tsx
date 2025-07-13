import { Box, Button, Stack, styled, Typography, useTheme } from '@mui/material';
import { fromEvent } from 'file-selector';
import { useEffect, useMemo, useState } from 'react';
import type { DropEvent, FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { useLatest } from 'react-use';

import { CircularLoader, FileUploadVariant, FormErrorText } from '@/components';
import { useHtmlId, useScreenType } from '@/hooks';

import FileUploadIcon from '../../assets/FileUpload.svg';
import { FileUploaded, RejectedFiles } from './FileUploaded';
import { getBorderColour, getErrorMessage, getMimeTypes, getLegendText, validateFile } from './helperFunctions';
import type { FileUploadProps } from './types';

const BYTES_IN_MEGABYTES = 1048576;
const COMPACT_MIN_HEIGHT = '0px';
const MIN_HEIGHT = '228px';
const WIDTH = '368px';

const StyledImage = styled('img')(({ theme }) => ({
  maxWidth: theme.spacing(4),
  maxHeight: theme.spacing(4),
}));

const DEFAULT_NUMBER_OF_FILES_ALLOWED = 1;

const generateAlignments = (variant: FileUploadVariant) => {
  switch (variant) {
    case 'compact':
      return {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        uploadWidth: 'auto',
        headingMargin: 0,
        textAlignment: 'left' as CanvasTextAlign, // had to type this, mui got confused
        dropzoneContainer: {
          padding: 0,
          mt: { xs: 0, md: 1 },
          mb: { xs: 1, md: 0 },
        },
      };
    case 'default':
      return {
        justifyContent: { xs: 'flex-start', md: 'center' },
        alignItems: { xs: 'flex-start', md: 'center' },
        uploadWidth: '100%',
        headingMargin: 3,
        textAlignment: { xs: 'left', md: 'center' } as { xs: CanvasTextAlign; md: CanvasTextAlign }, // had to type this, mui got confused
        dropzoneContainer: {
          padding: { xs: 0, md: 5 },
          mt: { xs: 0, md: 2 },
          mb: { xs: 2, md: 0 },
        },
      };
  }
};

export const FileUpload = ({
  id: suppliedId,
  name,
  heading,
  legendText,
  /** The number of files that a user is allowed to upload at once or a total number of files a use can upload.
      We only accept one file by default. */
  maxFiles = DEFAULT_NUMBER_OF_FILES_ALLOWED,
  /** Max file size in MB */
  maxFileSize = 4,
  maxTotalMBSize,
  acceptedFormats = [],
  files,
  onFileDelete,
  onFileUpload,
  onRejectedFilesChange,
  errorMessage,
  subHeading,
  subText,
  linkSlot,
  isLoading,
  acceptedFormatsText,
  promptText,
  variant = 'default',
}: FileUploadProps) => {
  const id = useHtmlId('file-upload', suppliedId, name);

  const maxSizeInBytes = maxFileSize * BYTES_IN_MEGABYTES;
  let hasExceededMaxFiles = false;

  const { isMobile } = useScreenType();
  const theme = useTheme();

  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

  const hasExceededMaxCombinedSize = (uploaded: File) => {
    if (!maxTotalMBSize) return false;
    const totalFileSize = [...files, uploaded].reduce((previous, current) => previous + current.size, 0);
    return totalFileSize > maxTotalMBSize * BYTES_IN_MEGABYTES;
  };

  const handleRemoveAcceptedFile = (index: number) => {
    onFileDelete(index);
  };

  const onRejectedFilesChangeRef = useLatest(onRejectedFilesChange);
  useEffect(() => onRejectedFilesChangeRef.current?.(rejectedFiles), [onRejectedFilesChangeRef, rejectedFiles]);

  const handleClearRejectedFiles = () => setRejectedFiles([]);

  const onDrop = async (accepted: File[], rejected: FileRejection[]) => {
    if (rejected.length > 0) {
      // Overriding the drop zone's default error message with ours
      rejected.forEach((rejected) => {
        rejected.errors.forEach(
          (error) => (error.message = getErrorMessage(error.code, maxFiles, maxFileSize, acceptedFormatsText))
        );
      });

      setRejectedFiles((prev) => [...prev, ...rejected]);
    }

    await onFileUpload(accepted);
  };

  const getFilesFromEvent = async (event: DropEvent) => {
    const fileObjectArr = await fromEvent(event); // convert event to File obj for the dropzone
    hasExceededMaxFiles = fileObjectArr.length + files.length > maxFiles;
    return fileObjectArr;
  };

  const validator = (file: File) =>
    validateFile({
      file,
      maxFiles,
      maxFileSize,
      hasExceededMaxCombinedSize,
      hasExceededMaxFiles,
      acceptedFormats,
      acceptedFormatsText,
      maxSizeInBytes,
    });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getMimeTypes(acceptedFormats),
    maxSize: maxSizeInBytes,
    validator,
    maxFiles: maxFiles,
    multiple: maxFiles > 1,
    getFilesFromEvent,
  });

  const showFileUploadIcon = !isMobile;
  const themeLegendText = getLegendText(isMobile, maxFileSize, acceptedFormatsText);

  const variantStyles = useMemo(() => generateAlignments(variant), [variant]);

  const minHeight = variant === 'compact' ? COMPACT_MIN_HEIGHT : MIN_HEIGHT;

  return (
    <Box id={id}>
      <Box sx={{ mb: variantStyles.headingMargin }}>
        {heading && <Typography variant="h2">{heading}</Typography>}
        {subHeading && <Typography variant="h3">{subHeading}</Typography>}
        {subText}
        {linkSlot}
      </Box>
      {promptText && (
        <Typography variant="body2" sx={{ mb: { md: 2, xs: 0 } }}>
          {promptText}
        </Typography>
      )}
      {maxFiles > files.length && (
        <Stack
          sx={{
            justifyContent: variantStyles.justifyContent,
            alignItems: variantStyles.alignItems,
            borderRadius: 0.8,
            border: { xs: 'none', md: '2px dashed' },
            borderColor: (theme) => ({
              md: getBorderColour(theme, Boolean(errorMessage || rejectedFiles.length)),
            }),
            ...variantStyles.dropzoneContainer,
          }}
        >
          <Stack
            {...getRootProps()}
            sx={{
              justifyContent: variantStyles.justifyContent,
              alignItems: variantStyles.alignItems,
              minHeight: { xs: '100%', md: minHeight },
              width: variantStyles.uploadWidth,
              border: 'none',
              padding: 0,
              mt: 0,
            }}
          >
            {isLoading && (
              <Stack data-testid="loader" sx={{ position: 'relative', minHeight: minHeight, width: '100%' }}>
                {<CircularLoader label="Loading..." />}
              </Stack>
            )}
            {isDragActive && !isLoading && (
              <Stack
                sx={{
                  alignItems: variantStyles.alignItems,
                  gap: 1,
                  margin: { xs: 0, md: '0 auto' },
                  maxWidth: WIDTH,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: 40,
                  }}
                >
                  Drop files here
                </Typography>
              </Stack>
            )}
            {!isDragActive && !isLoading && (
              <>
                <Stack
                  sx={{
                    alignItems: variantStyles.alignItems,
                    maxWidth: { xs: WIDTH, md: 'unset' },
                  }}
                >
                  {showFileUploadIcon && <StyledImage alt="file-upload" src={FileUploadIcon} />}
                  {themeLegendText?.length && (
                    <Stack sx={{ my: 3 }}>
                      {themeLegendText.map((text, index) => (
                        <Typography
                          key={index}
                          sx={{
                            color: 'text.disabled',
                            textAlign: variantStyles.textAlignment,
                          }}
                        >
                          {text}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </Stack>
                <Button variant="outlined" color="secondary">
                  <input {...getInputProps()} name={name}></input>
                  Select File
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      )}
      <RejectedFiles files={rejectedFiles} onClear={handleClearRejectedFiles} />
      <FileUploaded files={files} maxFiles={maxFiles} isLoading={isLoading} onRemove={handleRemoveAcceptedFile} />
      {Boolean(errorMessage) && <FormErrorText sx={{ my: 2 }}>{errorMessage}</FormErrorText>}
    </Box>
  );
};
