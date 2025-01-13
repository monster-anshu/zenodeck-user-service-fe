import React, { useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PiSpinnerGapLight } from 'react-icons/pi';
import { toast } from 'sonner';
import { IFile } from '~/api/file-upload.api';
import { checkAudioVideo, getImageDimensions } from './utils';

export function formatFileSize(fileSizeInBytes: number): string {
  if (fileSizeInBytes === 0) {
    return '0 B';
  }

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(fileSizeInBytes) / Math.log(1024));

  return `${(fileSizeInBytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export interface IFileUploadProps {
  accept?: string;
  fileCheckRegex?: RegExp;
  fileInfo?: {
    type?: string;
    maxSize?: number;
    width?: number;
    height?: number;
  };
  module?: string;
  uploadFn?: (
    file: File,
    module?: string,
    onProgress?: (progress: number) => void,
  ) => Promise<IFile> | IFile;
  hideLoader?: boolean;
  onProgress?: (progress: number) => void;
  onError?: (error: boolean) => void;
  disabled?: boolean;
}

export interface IFileUploadRef {
  openFile: (value: {
    onFileUpload: (file: IFile) => void;
    file?: File | null;
  }) => void;
}

const FileUpload = React.forwardRef<IFileUploadRef, IFileUploadProps>(
  function FileUpload(
    {
      accept,
      fileCheckRegex,
      fileInfo = {},
      uploadFn,
      module,
      hideLoader,
      onProgress,
      disabled,
      onError,
    },
    ref,
  ) {
    const eventRef = useRef<{
      onFileUpload?: (file: IFile) => void;
    }>({});
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setProgress] = useState({
      progress: 0,
      isVisible: false,
    });

    const startUploadFile = async (selectedFile: File) => {
      try {
        setProgress({
          isVisible: true,
          progress: 0,
        });
        const res = await uploadFn?.(selectedFile, module, onProgress);
        if (!res) return;
        eventRef.current.onFileUpload?.(res);
        onProgress?.(0);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        onProgress?.(0);
        setProgress({
          isVisible: false,
          progress: 0,
        });
      }
    };

    const handleFile = async (selectedFile: File) => {
      if (disabled) return;
      const { type, maxSize = 25 } = fileInfo;
      const sizeInByte = (maxSize || 0) * 1024 * 1024;
      if (maxSize && sizeInByte < selectedFile.size) {
        onError?.(true);
        toast.error('File size must not exceed ' + formatFileSize(sizeInByte));
        return;
      }
      if (fileCheckRegex && !fileCheckRegex.test(selectedFile.name)) {
        onError?.(true);
        toast.error('File type not supported');
        return;
      }

      if (selectedFile.type.includes('video')) {
        const isVideo = await checkAudioVideo(selectedFile);
        selectedFile = new File([selectedFile], selectedFile.name, {
          ...selectedFile,
          type: isVideo ? 'video/mp4' : 'audio/mp4',
        });
      }

      if (type === 'img' && (fileInfo.width || fileInfo.height)) {
        const { height, width } = await getImageDimensions(selectedFile);

        if (
          (fileInfo.width && fileInfo.width < width) ||
          (fileInfo.height && fileInfo.height < height)
        ) {
          onError?.(true);
          toast.error(
            `Image dimensions should not exceed ${fileInfo.width}x${fileInfo.height} pixels `,
          );
          return;
        }
        startUploadFile(selectedFile);
      } else {
        startUploadFile(selectedFile);
      }
      onError?.(false);
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (
      event,
    ) => {
      const { target } = event;
      const file = target.files?.[0];
      if (!file) return;
      onError?.(false);
      handleFile(file);
      if (inputRef.current) inputRef.current.value = '';
    };

    useImperativeHandle(ref, () => ({
      openFile: ({ onFileUpload, file }) => {
        eventRef.current.onFileUpload = onFileUpload;
        if (file instanceof File) {
          handleFile(file);
          return;
        }
        inputRef.current?.click();
      },
    }));

    return (
      <>
        {!hideLoader &&
          loading.isVisible &&
          createPortal(
            <div className='fixed bottom-0 left-0 right-0 top-0 z-[100] grid place-items-center bg-black/40'>
              <PiSpinnerGapLight className='mx-auto my-5 animate-spin text-3xl' />
            </div>,
            document.body,
          )}
        <input
          disabled={disabled}
          type='file'
          onChange={disabled ? undefined : handleChange}
          accept={accept}
          ref={inputRef}
          style={{ display: 'none' }}
        />
      </>
    );
  },
);

export default FileUpload;
