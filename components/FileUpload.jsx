import useModalStore from '@/modal.storage';
import React, { useState } from 'react'

const FileUpload = ({handleChange, handleUpload, selectedFile, uploadProgress}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { closeModal } = useModalStore();


  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const acceptedTypes = ['audio', 'application']; // Specify accepted file types
      const isValidFileType = Array.from(files).every((file) => {
        const fileType = file.type.split('/')[0];
        return acceptedTypes.includes(fileType);
      });

      if (isValidFileType) {
        handleChange({ target: { files: [files[0]] } });
      } else {
        alert('Please drop only audio or doc files.');
      }
    }
  };
  
  return (
    <div 
      className={`bg-white shadow-md rounded-md p-6 w-full mb-10 ${
        isDragging ? 'border-2 border-dashed border-blue-600' : ''
        }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className='flex items-center justify-between mb-2'>
        <h2 className="text-xl font-semibold ">Upload Files</h2>
        <button onClick={() => closeModal()}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className='mb-4'>
      Upload audio (MP3) or document (DOC) files easily. Ensure selected files match the supported formats for a smooth experience.
      </p>
      <div className="space-y-4">  
        <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              {/* Add your file upload icon here */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7 4 4V5l13 13-13 13v-7l-4 4z"
              />
            </svg>
            <div className={`text-sm text-gray-600 ${selectedFile && 'w-4/5 mx-auto overflow-hidden'}`}>
              {selectedFile ? (
                <p className="font-medium text-indigo-600 hover:text-indigo-500">
                  {selectedFile.name}
                </p> 
              ): (
                <label htmlFor="fileInput" className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  Select a file
                </label>
              )}
              <p className="text-xs text-gray-500">or drag and drop</p>
            </div>
          </div>
        </div>
        <input
          id="fileInput"
          type="file"
          className="sr-only"
          accept="audio/*,.doc, .pdf"
          onChange={handleChange}
        />
        <div className='flex items-center gap-5 justify-between'>
          <div className="w-4/5 flex items-center justify-between">
            {uploadProgress > 0 && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-500 rounded-md h-2.5"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 ml-2">{`${uploadProgress.toFixed(2)}%`}</span>
              </>
            )}
          </div>
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`${!selectedFile ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'}  text-white py-2 px-4 rounded-md`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileUpload