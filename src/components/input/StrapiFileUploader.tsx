import React, { useState, useRef, useEffect } from 'react';
import { Upload,  File, Image, Loader2, CheckCircle, Trash2 } from 'lucide-react';
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
  onFileDelete,
  existingFiles,
  disabled=false,
  

}) => {
  const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<IStrapiUploadResponse[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth(); 

 
  // Initialize with existing files
  useEffect(() => {
    if (existingFiles && existingFiles.length > 0) {
      setUploadedFiles(existingFiles);
    }
  }, [existingFiles]);

  // Calculate if upload should be disabled
  const shouldDisableUpload = () => {
    if (disabled) return true;
    if (!multiple && uploadedFiles.length >= 1) return true;
    if (multiple && uploadedFiles.length >= maximumFileCount) return true;
    return false;
  };

  const getMediaTypeIcon = (file: IStrapiUploadResponse) => {
    if (file?.mime?.startsWith('image/') && file.formats?.thumbnail?.url) {
      return (
        <img
          src={file.formats.thumbnail.url}
          alt={file.name}
          className="w-8 h-8 object-cover rounded"
        />
      );
    }
    // Fallback to generic icon
    return (
      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
        {file?.mime?.startsWith('image/') ? (
          <Image className="w-4 h-4 text-gray-500" />
        ) : (
          <File className="w-4 h-4 text-gray-500" />
        )}
      </div>
    );
  };

  const handleFileUpload = async (files: FileList) => {
    if (shouldDisableUpload()) {
      toast.error('Upload limit reached. Please remove existing files first.');
      return;
    }

    const fileArray = Array.from(files);
    const remainingSlots = multiple ? maximumFileCount - uploadedFiles.length : 1;
    
    if (fileArray.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more file${remainingSlots > 1 ? 's' : ''}`);
      return;
    }

    // Check if the number of files exceeds the limit
    if (fileArray.length > 5) {
      toast.error('You can upload a maximum of 5 files at a time');
      return;
    }

    if (!multiple && fileArray.length > 1) {
      toast.error('Only one file can be uploaded at a time');
      return;
    }

    setIsUploading(true);
    try {
      const successfulUploads: IStrapiUploadResponse[] = [];
      
      for (const file of fileArray) {
        const validationError = mediaTypesHealper.validateFile(file, maxFileSize, mediaType);
        if (validationError) {
          toast.error(validationError);
          continue;
        }

        const uploadedFile = await mediaUploadToStrapiService.uploadToStrapi(token, file, maxFileSize, mediaType);
        
        successfulUploads.push(uploadedFile);
        toast.success(`${file.name} uploaded successfully`);
      }

      if (successfulUploads.length > 0) {
        setUploadedFiles(prev => [...prev, ...successfulUploads]);
        successfulUploads.forEach(file => onUploadSuccess(file));
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
    
    if (shouldDisableUpload()) {
      toast.error('Upload limit reached. Please remove existing files first.');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDeleteFile = async (file: IStrapiUploadResponse) => {
    setIsDeleting(file.id);
    try {
      // Delete from backend
      await mediaUploadToStrapiService.deleteFromStrapi(token, file.id);
      
      // Remove from local state
      setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
      
      // Call callback if provided
      onFileDelete?.(file);
      
      toast.success(`${file.name} deleted successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
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

  const getLimitMessage = () => {
    if (!multiple && uploadedFiles.length >= 1) {
      return 'Maximum of 1 file reached. Delete the existing file to upload a new one.';
    }
    if (multiple && uploadedFiles.length >= maximumFileCount) {
      return `Maximum of ${maximumFileCount} files reached. Delete existing files to upload new ones.`;
    }
    return null;
  };

  const uploadDisabled = shouldDisableUpload();
  const limitMessage = getLimitMessage();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area - Hide or show limit message when disabled */}
      {!uploadDisabled ? (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer hover:bg-gray-50 ${
            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {isUploading ? 'Uploading...' : getPlaceholderText()}
                </p>
                
                <p className="text-xs text-gray-500">
                  {mediaType === 'image' && 'Images only'}
                  {mediaType === 'file' && 'PDF, Word, Excel files only'}
                  {mediaType === 'both' && 'Images and documents'}
                  {` • Max ${maxFileSize}MB`}
                  {multiple && ` • Up to ${maximumFileCount} files`}
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple={multiple}
                onChange={handleInputChange}
                accept={mediaType === 'image' ? 'image/*' : mediaType === 'file' ? '.pdf,.doc,.docx,.xls,.xlsx' : '*'}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-gray-200 bg-gray-50">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p className="text-sm font-medium text-gray-600">{limitMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files Display */}
      {uploadedFiles && uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Uploaded Files: ({uploadedFiles.length}/{multiple ? maximumFileCount : 1})
            </h4>
            
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                <div className="flex items-center space-x-3">
                  {getMediaTypeIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting === file.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file);
                  }}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  {isDeleting === file.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StrapiFileUploader;