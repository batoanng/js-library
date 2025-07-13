import { useAsyncFn } from 'react-use';

import type { FileModel, FileUploadApi } from './types';

interface UseUpdateFileOptions {
  onFailure: (errorMessage: string) => void;
}

export const useSendFiles = ({ onFailure }: UseUpdateFileOptions) => {
  const [{ loading }, sendFiles] = useAsyncFn(
    async (api: FileUploadApi, uploadedFiles: File[], currentFiles: FileModel[]) => {
      try {
        for (const file of uploadedFiles) {
          const fileId = await api.uploadFile(file);
          if (fileId) {
            currentFiles.push({ id: fileId, name: file.name, size: file.size, type: file.type });
          }
        }
      } catch (error) {
        const message = (error as Error).message;
        onFailure(message);
      }
    },
    [onFailure]
  );
  return { isSendingFile: loading, sendFiles };
};

export const useDeleteFile = ({ onFailure }: UseUpdateFileOptions) => {
  const [{ loading }, deleteFile] = useAsyncFn(
    async (api: FileUploadApi, index: number, currentFiles: FileModel[]) => {
      const fileToRemove = currentFiles.find((_, i) => i === index);

      try {
        await api.removeFile((fileToRemove as FileModel).id as string);
      } catch (error: Error | unknown) {
        const message = (error as Error).message;
        onFailure(message);
      }
    },
    [onFailure]
  );

  return { isDeletingFile: loading, deleteFile };
};
