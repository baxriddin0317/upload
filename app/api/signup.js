import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/firebase/config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // You can perform additional actions on successful sign-up if needed
    return res.status(200).json({ success: true, data: userCredential.user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}