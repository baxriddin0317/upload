'use client'
import React, { useEffect, useState } from 'react'
import { auth, storage } from '../firebase/config';
import { getDownloadURL, getMetadata, listAll, ref } from 'firebase/storage';
import { format } from 'date-fns';

const page = () => {
  const [docFiles, setDocFiles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const audioRef = ref(storage, `audio/${userId}`);
        const audioFilesList = await listAll(audioRef);
        const audioFilesWithMetadata = await Promise.all(
          audioFilesList.items.map(async (audioFile) => {
            console.log(audioFile.name);
            const metadata = await getMetadata(audioFile);
            return { metadata };
          })
        );
        setAudioFiles(audioFilesWithMetadata);

        
        const docRef = ref(storage, `docs/${userId}`);
        console.log(docRef);
        const docFilesList = await listAll(docRef);
        const docFilesWithMetadata = await Promise.all(
          docFilesList.items.map(async (docFile) => {
            const metadata = await getMetadata(docFile);
            return { metadata };
          })
        );
        setDocFiles(docFilesWithMetadata);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [userId]);


  console.log(docFiles);
  return (
    <main className='flex min-h-screen flex-col items-center gap-20 px-4 py-20 md:p-24'>
      <div className='flex justify-start mb-4'>
        <h1 className='font-bold text-3xl'>Your Files id</h1>
      </div>

      <div className='grid md:grid-cols-2 gap-20'>
      <div>
        <h2 className='text-xl font-semibold mb-2'>Audio Files</h2>
        {audioFiles && audioFiles.map(({ file, metadata, downloadURL }, idx) => (
          <div key={idx}>
            <div key={idx} className='bg-white shadow-md rounded-md my-2 p-4'>
              <p className='border-b pb-2 mb-2 text-lg font-bold'>Token: <span className='text-sm'>{metadata.generation}</span></p>
              <CreatedTime time={metadata.timeCreated} />
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-2'>Doc Files</h2>
        {docFiles.map(({ file, metadata },idx) => (
          <div key={idx} className='bg-white shadow-md rounded-md my-2 p-4'>
            <p className='border-b pb-2 mb-2 text-lg font-bold'>Token: <span className='text-sm'>{metadata.generation}</span></p>
            <CreatedTime time={metadata.timeCreated} />
          </div>
        ))}
      </div>
    </div>
    </main>
  )
}

export default page

const CreatedTime = ({time}) => {
  const dateObject = new Date(time);

  const formattedDate = format(dateObject, "MMM d, yyyy, h:mm:ss a");
  return (
    <p>{formattedDate}</p>
  )
}