// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlyuw_IWkhqY9aKX-fmGhZBWi6I94pcjo",
  authDomain: "spotifyv2test0.firebaseapp.com",
  projectId: "spotifyv2test0",
  storageBucket: "spotifyv2test0.appspot.com",
  messagingSenderId: "551547053729",
  appId: "1:551547053729:web:ecb56a2d5430f173e272e0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const userzCollection = collection(db, "userz");
export const followingArtistzCollection = collection(db, "followingArtistz");
export const followingSongzCollection = collection(db, "followingSongz");
export const followingPlaylistzCollection = collection(
  db,
  "followingPlaylistz"
);
export const nihilGitHubCollection = collection(db, "nihilGitHub");

//Well done.
