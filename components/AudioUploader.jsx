'use client'
import ReactPlayer from 'react-player';
import React, { useEffect, useState } from 'react';
import { ref, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { storage } from '@/app/firebase/config'; // Update this import
import DocCard from './DocCard';
import useModalStore from '@/modal.storage';

const AudioUploader = ({ userId, uploading, audioFiles, setAudioFiles }) => {
  const [docFiles, setDocFiles] = useState([]);
  const {setModal} = useModalStore()

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        
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

    <div className='flex items-center justify-between mb-4'>
      <h1 className='font-bold text-3xl'>Your Files</h1>
      <button onClick={() => setModal()} className='bg-blue-500 text-white px-4 py-2 text-sm hover:scale-105 rounded-md capitalize mr-5'>
        ask doctor
      </button>
    </div>

    <div className='grid md:grid-cols-2 gap-4'>
      <div>
        <h2 className='text-xl font-semibold mb-2'>Audio Files</h2>
        {audioFiles.length > 0 ? audioFiles.map(({ file, metadata, downloadURL }, idx) => (
          <div key={idx}>
            {/* Render audio card component */}
            <AudioCard file={file} metadata={metadata} downloadURL={downloadURL} />
          </div>
        )) : (
          <p>You haven't uploaded files yet</p>
        )}
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-2'>Doc Files</h2>
        {docFiles.length > 0 ? docFiles.map(({ file, metadata },idx) => (
          <div key={idx}>
            {/* Render doc card component */}
            <DocCard file={file} metadata={metadata} />
          </div>
        )) : (
          <p>You haven't uploaded files yet</p>
        )}
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
