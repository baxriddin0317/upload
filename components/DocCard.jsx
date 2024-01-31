import { useState } from 'react';
import { ref, getDownloadURL, getMetadata } from 'firebase/storage';

const DocCard = ({ file, metadata }) => {
  const [error, setError] = useState(null);

  const openDoc = async () => {
    try {
      const url = await getDownloadURL(file);

      window.open(url, '_blank');
    } catch (error) {
      setError('Error opening document: ' + error.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md h-28 my-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{file.name}</h3>
        <button
          onClick={openDoc}
          className="bg-blue-500 text-white text-xs px-4 py-2 rounded-md"
        >
          Download
        </button>
      </div>
      <div className="flex items-center mb-4">
        {/* Mini image for doc file (you can replace with your own icon or image) */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
          <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
        </svg>
        <p className="text-gray-500">
          Size: {metadata?.size ? formatFileSize(metadata.size) : 'N/A'}
        </p>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export default DocCard;