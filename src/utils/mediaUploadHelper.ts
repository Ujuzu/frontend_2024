export const mediaTypesHealper = {
      getAcceptedTypes: (mediaType:string) => {
    switch (mediaType) {
      case 'image':
        return 'image/*';
      case 'file':
        return '.pdf,.doc,.docx,.xls,.xlsx,.txt';
      case 'both':
        return 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt';
      default:
        return '*';
    }
  },

  validateFile: (file: File, maxFileSize:number, mediaType:string ): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isDocument = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ].includes(file.type);

    switch (mediaType) {
      case 'image':
        if (!isImage) return 'Only image files are allowed';
        break;
      case 'file':
        if (!isDocument) return 'Only PDF, Word, Excel, and text files are allowed';
        break;
      case 'both':
        if (!isImage && !isDocument) return 'Only images, PDF, Word, Excel, and text files are allowed';
        break;
    }

    return null;
  },
}