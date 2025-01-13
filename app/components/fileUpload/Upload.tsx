/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useRef, useState } from 'react';
import { IFile } from '~/api/file-upload.api';
import { cn } from '~/lib/utils';
import FileUpload, { IFileUploadProps, IFileUploadRef } from './FileUpload';

export interface IUploadProps extends IFileUploadProps {
  children?: (value: IUploadChildrenOption) => React.ReactNode;
  onUpload?: (file: IFile) => void;
  onError?: (error: boolean) => void;
  className?: string;
  classNameOnDrag?: string;
  clickable?: boolean;
}

interface IUploadChildrenOption {
  ref: React.RefObject<IFileUploadRef>;
  dragging: boolean;
  open: () => unknown;
}

const Upload: FC<IUploadProps> = ({
  children,
  onUpload,
  onError,
  className,
  classNameOnDrag,
  clickable,
  ...props
}) => {
  const fileUploadRef = useRef<IFileUploadRef>(null);
  const [dragging, setDragging] = useState(false);

  const onFileUpload = (file: IFile) => {
    onUpload?.(file);
  };

  return (
    <div
      className={cn(
        'relative',
        clickable && 'cursor-pointer',
        className,
        dragging && classNameOnDrag,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        fileUploadRef.current?.openFile({
          onFileUpload,
          file,
        });
      }}
      onClick={
        !clickable
          ? undefined
          : () => {
              fileUploadRef.current?.openFile({
                onFileUpload,
              });
            }
      }
    >
      {children?.({
        dragging,
        open() {
          fileUploadRef.current?.openFile({
            onFileUpload,
          });
        },
        ref: fileUploadRef,
      })}
      <FileUpload {...props} onError={onError} ref={fileUploadRef} />
    </div>
  );
};

export default Upload;
