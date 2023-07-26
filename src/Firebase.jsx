// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUK6tle0cFMeAAOp3KL0vpbPDRparK5ps",
  authDomain: "spotifyapiprojectv2emp.firebaseapp.com",
  projectId: "spotifyapiprojectv2emp",
  storageBucket: "spotifyapiprojectv2emp.appspot.com",
  messagingSenderId: "775032505382",
  appId: "1:775032505382:web:f2fc5e7563b967608112e7",
  measurementId: "G-8DN1LZ71CP",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const userzCollection = collection(db, "userz");
export const followingArtistzCollection = collection(db, "followingArtistz");
export const followingSongzCollection = collection(db, "followingSongz");
export const followingPlaylistzCollection = collection(
  db,
  "followingPlaylistz"
);
export const nihilGitHubCollection = collection(db, "nihilGitHub");
export const countEmCollection = collection(db, "countEm");

//Well done.
