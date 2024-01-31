import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { app, auth, storage } from './config';

const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

const uploadFile = async (file, userId) => {
  const storageRef = ref(storage, `audio/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

const getFiles = async (userId) => {
  const storageRef = ref(storage, `audio/${userId}`);
  const files = await listAll(storageRef);
  const fileUrls = await Promise.all(files.items.map(async (file) => getDownloadURL(file)));
  return fileUrls;
};

export { signIn, getCurrentUser, uploadFile, getFiles };