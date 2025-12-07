import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { fromEvent } from 'file-selector';
import { useEffect, useMemo, useState } from 'react';
import type { DropEvent, FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { useLatest } from 'react-use';

import { CircularLoader, FileUploadVariant, FormErrorText } from '@/components';
import { useHtmlId, useScreenType } from '@/hooks';
import { FileUploaded, RejectedFiles } from './FileUploaded';
import { getErrorMessage, getMimeTypes, getLegendText, validateFile } from './helperFunctions';
import type { FileUploadProps } from './types';
import { IconFileImport } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const BYTES_IN_MEGABYTES = 1048576;
const COMPACT_MIN_HEIGHT = '0px';
const MIN_HEIGHT = '228px';
const WIDTH = '368px';

const DEFAULT_NUMBER_OF_FILES_ALLOWED = 1;

const MotionBox = motion(Box);
const MotionButton = motion(Button as any);

const generateAlignments = (variant: FileUploadVariant) => {
  switch (variant) {
    case 'compact':
      return {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        uploadWidth: '100%',
        headingMargin: 0,
        textAlignment: 'left' as CanvasTextAlign,
        dropzoneContainer: {
          padding: 0,
          mt: { xs: 0, md: 1 },
          mb: { xs: 1, md: 0 },
        },
      };
    case 'default':
    default:
      return {
        justifyContent: { xs: 'flex-start', md: 'center' },
        alignItems: { xs: 'flex-start', md: 'center' },
        uploadWidth: '100%',
        headingMargin: 3,
        textAlignment: {
          xs: 'left',
          md: 'center',
        } as { xs: CanvasTextAlign; md: CanvasTextAlign },
        dropzoneContainer: {
          padding: { xs: 0, md: 0 },
          mb: { xs: 2, md: 0 },
        },
      };
  }
};

export const FileUpload = ({
  id: suppliedId,
  name,
  heading,
  maxFiles = DEFAULT_NUMBER_OF_FILES_ALLOWED,
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
  const { isMobile } = useScreenType();
  const theme = useTheme();

  const maxSizeInBytes = maxFileSize * BYTES_IN_MEGABYTES;
  let hasExceededMaxFiles = false;

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
      rejected.forEach((rej) => {
        rej.errors.forEach(
          (error) => (error.message = getErrorMessage(error.code, maxFiles, maxFileSize, acceptedFormatsText))
        );
      });

      setRejectedFiles((prev) => [...prev, ...rejected]);
    }

    if (accepted.length > 0) {
      await onFileUpload(accepted);
    }
  };

  const getFilesFromEvent = async (event: DropEvent) => {
    const fileObjectArr = await fromEvent(event);
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

  const hasDropError = Boolean(errorMessage || rejectedFiles.length);

  return (
    <Box id={id} sx={{ width: '100%' }}>
      {Boolean(heading || subHeading || subText || linkSlot) && (
        <Box sx={{ mb: variantStyles.headingMargin }}>
          {heading && (
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {heading}
            </Typography>
          )}
          {subHeading && (
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {subHeading}
            </Typography>
          )}
          {subText}
          {linkSlot}
        </Box>
      )}

      {promptText && (
        <Typography variant="body2" sx={{ mb: { md: 2, xs: 0 } }}>
          {promptText}
        </Typography>
      )}

      {maxFiles > files.length && (
        <Box
          sx={{
            ...variantStyles.dropzoneContainer,
            position: 'relative',
            width: '100%',
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: -4,
              borderRadius: 3,
              background: `radial-gradient(circle at top, ${theme.palette.primary.main}33, transparent 60%)`,
              filter: 'blur(18px)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          <MotionBox
            {...(getRootProps() as any)}
            whileHover={{
              translateY: -2,
              boxShadow: '0 18px 50px rgba(15,23,42,0.95), 0 0 0 1px rgba(148,163,184,0.25)',
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            sx={{
              position: 'relative',
              zIndex: 1,
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              border: `1px solid ${hasDropError ? theme.palette.error.main : 'rgba(51,65,85,0.8)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: '100%', md: minHeight },
              cursor: isLoading ? 'default' : 'pointer',
              overflow: 'hidden',
            }}
          >
            {/* This is the hidden input that react-dropzone uses */}
            <input {...getInputProps()} name={name} />

            {isLoading && (
              <Stack
                data-testid="loader"
                sx={{
                  position: 'relative',
                  minHeight: minHeight,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularLoader label="Uploading…" />
              </Stack>
            )}

            {!isLoading && (
              <>
                {showFileUploadIcon && (
                  <MotionBox
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: theme.palette.getContrastText(theme.palette.primary.main),
                      boxShadow:
                        theme.palette.mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.8)' : '0 8px 24px rgba(0,0,0,0.25)',
                      mb: 2,
                    }}
                  >
                    <IconFileImport size={32} />
                  </MotionBox>
                )}

                {isDragActive ? (
                  <Stack
                    sx={{
                      alignItems: 'center',
                      gap: 1,
                      margin: { xs: 0, md: '0 auto' },
                      maxWidth: WIDTH,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: 32,
                        fontWeight: 700,
                        textAlign: 'center',
                      }}
                    >
                      Drop files here
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      We&apos;ll take care of the rest.
                    </Typography>
                  </Stack>
                ) : (
                  <Stack
                    sx={{
                      alignItems: 'center',
                      maxWidth: { xs: WIDTH, md: '100%' },
                      textAlign: 'center',
                    }}
                    spacing={2}
                  >
                    {themeLegendText?.length > 0 && (
                      <Stack>
                        {themeLegendText.map((text, index) => (
                          <Typography
                            key={index}
                            sx={{
                              color: 'text.secondary',
                              textAlign: variantStyles.textAlignment,
                            }}
                          >
                            {text}
                          </Typography>
                        ))}
                      </Stack>
                    )}

                    <Typography variant="body2" color="text.disabled">
                      Drag &amp; drop a file here, or
                    </Typography>

                    <MotionButton
                      variant="contained"
                      color="primary"
                      type="button"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
                      }}
                      whileTap={{ scale: 0.97 }}
                      sx={{
                        borderRadius: 999,
                        px: 3.5,
                        height: 42,
                      }}
                    >
                      Select File
                    </MotionButton>
                  </Stack>
                )}
              </>
            )}
          </MotionBox>
        </Box>
      )}

      <RejectedFiles files={rejectedFiles} onClear={handleClearRejectedFiles} />
      <FileUploaded files={files} maxFiles={maxFiles} isLoading={isLoading} onRemove={handleRemoveAcceptedFile} />
      {Boolean(errorMessage) && <FormErrorText sx={{ my: 2 }}>{errorMessage}</FormErrorText>}
    </Box>
  );
};
