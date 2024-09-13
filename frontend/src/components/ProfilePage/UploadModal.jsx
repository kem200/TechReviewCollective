import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './UploadModal.css'; // Add your custom styles here

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log('Accepted Files:', acceptedFiles); // Debugging log

    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]); // Upload the first accepted file
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif'], // Correct MIME types and extensions
    },
    maxFiles: 1, // Limit to one file
  });

  if (!isOpen) return null; // Don't render if the modal is closed

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal">
        <button className="close-button" onClick={onClose}>
          &times; {/* Close button */}
        </button>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here ...</p>
          ) : (
            <p>Drag and drop a profile image here, or click to select one</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
