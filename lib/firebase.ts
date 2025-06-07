import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDTAqmgrQcdNh2lVKuh5lvS-ryIgjuXHAA",
  authDomain: "footballtop-a4271.firebaseapp.com",
  projectId: "footballtop-a4271",
  storageBucket: "footballtop-a4271.appspot.com",
  messagingSenderId: "212557115335",
  appId: "1:212557115335:web:581f44ae360e4464e333e2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
