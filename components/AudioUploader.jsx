'use client'
import ReactPlayer from 'react-player';
import React, { useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { storage } from '@/app/firebase/config'; // Update this import
import FileUpload from './FileUpload';
import DocCard from './DocCard';

const AudioUploader = ({ userId }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioFiles, setAudioFiles] = useState([]);
  const [docFiles, setDocFiles] = useState([]);
  
  const handleChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
  };
  // upload file
  const handleUpload = async () => {
    let storageRef;
    const fileType = audioFile.type.split('/')[0]; // Extract the file type (audio, doc, etc.)
    if (fileType === 'audio') {
      storageRef = ref(storage, `audio/${userId}/${audioFile?.name}`);
    } else if (fileType === 'application') {
      // Assume application type is for documents, adjust as needed
      storageRef = ref(storage, `docs/${userId}/${audioFile?.name}`);
    } else {
      console.log("Unsupported file type");
      // return;
    }

    try {
      if (audioFile) {
        const uploadTask = uploadBytesResumable(storageRef, audioFile);
        setUploading(true);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            console.error(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setAudioFiles((prev) => [...prev, downloadURL])
              setUploading(false);
            });
          }
        );
      }
    } catch (error) {
      console.log(fileType === 'audio');     
    }
  };

  useEffect(() => {
    if(!uploading){
      setAudioFile(null)
      setProgress(0)
    }
  }, [uploading])

  // get all upload files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Fetch audio files
        const audioRef = ref(storage, `audio/${userId}`);
        const audioFilesList = await listAll(audioRef);
        const audioFilesWithMetadata = await Promise.all(
          audioFilesList.items.map(async (audioFile) => {
            const metadata = await getMetadata(audioFile);
            const downloadURL = await getDownloadURL(audioFile);
            return { file: audioFile, metadata, downloadURL };
          })
        );
        setAudioFiles(audioFilesWithMetadata);

        // Fetch doc files (modify the path accordingly)
        const docRef = ref(storage, `docs/${userId}`);
        console.log(docRef);
        const docFilesList = await listAll(docRef);
        const docFilesWithMetadata = await Promise.all(
          docFilesList.items.map(async (docFile) => {
            const metadata = await getMetadata(docFile);
            return { file: docFile, metadata };
          })
        );
        setDocFiles(docFilesWithMetadata);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [userId, uploading]);

  return (
    <div className='max-w-5xl w-full'>
      <FileUpload handleChange={handleChange} handleUpload={handleUpload} selectedFile={audioFile} uploadProgress={progress} />

      <h1 className='font-bold text-3xl mb-4'>Your Files</h1>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <h2 className='text-xl font-semibold mb-2'>Audio Files</h2>
          {audioFiles && audioFiles.map(({ file, metadata, downloadURL }, idx) => (
            <div key={idx}>
              {/* Render audio card component */}
              <AudioCard file={file} metadata={metadata} downloadURL={downloadURL} />
            </div>
          ))}
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-2'>Doc Files</h2>
          {docFiles.map(({ file, metadata },idx) => (
            <div key={idx}>
              {/* Render doc card component */}
              <DocCard file={file} metadata={metadata} />
            </div>
          ))}
        </div>
    </div>
    </div>
  );
};


// Example AudioCard component
const AudioCard = ({ file, metadata, downloadURL }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md h-28 my-4">
      <h3 className="font-semibold mb-2 w-4/5 overflow-hidden">{file && file.name}</h3>
      <div className="audio-player">
        <ReactPlayer
          url={downloadURL}
          controls
          width="100%"
          height="50px"
        />
      </div>
    </div>
  );
};

export default AudioUploader;
