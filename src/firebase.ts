// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChCZziYcMrDO6N7YDoEB7bGU58ndmcADg",
  authDomain: "zensteri.firebaseapp.com",
  projectId: "zensteri",
  storageBucket: "zensteri.appspot.com",
  messagingSenderId: "901371363715",
  appId: "1:901371363715:web:433cb6a26a553e248a76b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseApp = app;
export const auth = getAuth(app);
auth.languageCode = 'en';
export const analytics = getAnalytics(app);
