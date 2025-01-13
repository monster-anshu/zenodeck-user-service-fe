import axios from 'axios';
import { ApiResponse, client } from './client';

export default class FileUploadApi {
  static async upload(
    file: File,
    module?: string,
    onProgress?: (progress: number) => void,
  ): Promise<IFile> {
    console.log(file);
    try {
      if (!file.type) {
        throw new Error('File type not supported');
      }
      onProgress?.(2);
      const res = await client.post<UPLOAD_RESPONSE>(`/user/file/upload`, {
        mimeType: file.type || file.name.split('.').pop(),
        fileName: file.name,
        module,
      });
      onProgress?.(10);
      const { data: signedUrlData } = res;

      const { url, fields } = signedUrlData;

      const formData = new FormData();
      for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value);
      }
      formData.append('file', file);

      const { status } = await axios.post(url, formData, {
        onUploadProgress(progressEvent) {
          const { loaded, total } = progressEvent;
          if (!total) return;
          let percent = Math.floor((loaded * 100) / total);
          if (percent < 10) {
            percent = 10;
          }
          if (percent < 100) {
            onProgress?.(percent);
          } else {
            onProgress?.(100);
          }
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (status >= 400) {
        onProgress?.(0);
        throw new Error("Couldn't upload file");
      }

      return {
        name: file.name,
        size: file.size,
        url: url + '/' + fields.key,
        file: file,
        key: fields.key,
        bucket: fields.bucket,
        contentType: file.type,
      };
    } catch (error) {
      let message = "Couldn't upload file";
      if (error instanceof Error) {
        message = messages[error.message] || error.message || message;
      }
      throw new Error(message);
    } finally {
      onProgress?.(0);
    }
  }

  static async delete(key: string) {
    const { data } = await client.post<ApiResponse>(`/file/delete`, {
      key: key,
    });
    return data;
  }
}

type UPLOAD_RESPONSE = {
  isSuccess: boolean;
  url: string;
  fields: Fields;
  error?: string;
};

interface Fields {
  ContentType: string;
  ACL: string;
  bucket: string;
  'X-Amz-Algorithm': string;
  'X-Amz-Credential': string;
  'X-Amz-Date': string;
  'X-Amz-Security-Token': string;
  key: string;
  Policy: string;
  'X-Amz-Signature': string;
}

export interface IUploadProgress {
  isTrusted: boolean;
  lengthComputable: boolean;
  loaded: number;
  total: number;
}

const messages = {
  MIME_TYPE_NOT_SUPPORTED: 'File format not supported',
} as Record<string, string>;

export type IFile = {
  name: string;
  size: number;
  url: string;
  file: File;
  key: string;
  bucket: string;
  contentType: string;
};
