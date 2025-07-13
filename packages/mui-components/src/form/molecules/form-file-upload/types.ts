export interface FileUploadApi {
  uploadFile: (file: File) => Promise<string | undefined>;
  removeFile: (fileId: string) => Promise<void>;
}

export type FileModel = {
  id?: string;
  name?: string;
  size?: number;
  type?: string;
};
