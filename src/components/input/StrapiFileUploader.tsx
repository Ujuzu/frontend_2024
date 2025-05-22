import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { IStrapiFileUploaderProps, IStrapiUploadResponse } from '@/Interfaces/IStrapiFileUploader';
import { mediaTypesHealper } from '@/utils/mediaUploadHelper';
import { useAuth } from '@/context/AuthContext';
import { mediaUploadToStrapiService } from '@/service/uploadToStrapiService';

/**
 * StrapiFileUploader component allows users to upload files to Strapi.
 * It supports drag-and-drop functionality and displays uploaded files.
 *
 * @param {IStrapiFileUploaderProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */

const StrapiFileUploader: React.FC<IStrapiFileUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  mediaType = 'both',
  maxFileSize = 10,
  multiple = false,
  className = '',
  placeholder,
  maximumFileCount = 1,

}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<IStrapiUploadResponse[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth(); 

  const getMediaTypeIcon = (file: IStrapiUploadResponse) => {
if (file.mime.startsWith('image/') && file.formats?.thumbnail?.url) {
    return (
      <img
        src={file.formats.thumbnail.url}
        alt={file.name}
        className="w-10 h-10 object-cover rounded"
      />
    );
  }

  // Fallback to generic icon
  return (
    <div className="flex items-center gap-1">
      {file.mime.startsWith('image/') ? (
        <Image className="w-4 h-4" />
      ) : (
        <File className="w-4 h-4" />
      )}
      <CheckCircle className="w-4 h-4 text-green-500" />
    </div>
  );
  };

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    // Check if the number of files exceeds the limit
    if (fileArray.length > 5) {
      toast.error('You can upload a maximum of 5 files at a time');
      return;
    }
    // check max file count
        if (fileArray.length > maximumFileCount) {
      toast.error(`You can upload a maximum of ${maximumFileCount} "file" ${maximumFileCount > 1 ? 's' : ''} at a time`);
      }

    if (!multiple && fileArray.length > 1) {
      toast.error('Only one file can be uploaded at a time');
      return;
    }

    setIsUploading(true);

    try {
      for (const file of fileArray) {
        const validationError = mediaTypesHealper.validateFile(file, maxFileSize, mediaType);
        if (validationError) {
          toast.error(validationError);
          continue;
        }

        const uploadedFile = await mediaUploadToStrapiService.uploadToStrapi(token, file, maxFileSize, mediaType);
        
        setUploadedFiles(prev => [...prev, uploadedFile]);
        onUploadSuccess(uploadedFile);
        toast.success(`${file.name} uploaded successfully`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const removeUploadedFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getPlaceholderText = () => {
    if (placeholder) return placeholder;
    
    switch (mediaType) {
      case 'image':
        return 'Click to upload images or drag and drop';
      case 'file':
        return 'Click to upload documents or drag and drop';
      case 'both':
        return 'Click to upload files or drag and drop';
      default:
        return 'Click to upload or drag and drop';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 px-4">
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
          )}
          
          <p className="text-sm text-gray-600 text-center mb-2">
            {isUploading ? 'Uploading...' : getPlaceholderText()}
          </p>
          
          <p className="text-xs text-gray-400 text-center">
            {mediaType === 'image' && 'Images only'}
            {mediaType === 'file' && 'PDF, Word, Excel files only'}
            {mediaType === 'both' && 'Images and documents'}
            {` • Max ${maxFileSize}MB`}
          </p>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={mediaTypesHealper.getAcceptedTypes(mediaType)}
            multiple={multiple}
            onChange={handleInputChange}
            disabled={isUploading}
          />
        </CardContent>
      </Card>

      {/* Uploaded Files Display */}
      {uploadedFiles && uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md"
            >
              <div className="flex items-center space-x-2">
                {getMediaTypeIcon(file)}
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeUploadedFile(file.id);
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StrapiFileUploader;