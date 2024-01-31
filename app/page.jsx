"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import AudioUploader from "@/components/AudioUploader";
import Link from "next/link";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

export default function Home() {
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
      <Header />
      <main className="flex min-h-screen flex-col items-center gap-20 p-24">
        <AudioUploader userId={userId} />
      </main>
    </>
  );
}
