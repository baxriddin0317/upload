"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import AudioUploader from "@/components/AudioUploader";
import Link from "next/link";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [modal, setModal] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userId = auth.currentUser?.uid;


  let userSession
  if (typeof window !== 'undefined') {
    userSession = sessionStorage.getItem("user")
  }
  
  useEffect(() => {
    if (!user && !userSession) {
      router.push("/sign-in");
    }
  }, [user, userSession]);

  return (
    <>
      <Header setModal={setModal} />
      <main className="flex min-h-screen flex-col items-center gap-20 p-24">
        <AudioUploader userId={userId} uploading={uploading} setAudioFiles={setAudioFiles} audioFiles={audioFiles} />
      </main>
      <div className={`fixed ${modal ? 'top-0' : '-top-full'} left-0 w-full h-full z-50`}>
        <div onClick={() => setModal(false)} className="absolute bg-black/40 -z-10 top-0 left-0 w-full h-full"></div>
        <div className={`${modal ? 'top-10' : 'top-0'} absolute left-1/2 -translate-x-1/2 w-full lg:w-1/2 mx-auto transition-all duration-500`}>
          <Modal setUploading={setUploading} uploading={uploading} setAudioFiles={setAudioFiles} userId={userId} setModal={setModal} />
        </div>
      </div>
    </>
  );
}
