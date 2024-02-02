import React, { useEffect, useState } from 'react'
import FileUpload from './FileUpload';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/app/firebase/config';

const Modal = ({setUploading, uploading, setAudioFiles, userId}) => {
  const [progress, setProgress] = useState(0);
  const [audioFile, setAudioFile] = useState(null);

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

  return <FileUpload handleChange={handleChange} handleUpload={handleUpload} selectedFile={audioFile} uploadProgress={progress} />
}

export default Modal