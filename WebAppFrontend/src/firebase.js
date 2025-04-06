import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCruIr0gWdJN89oxujxJFLYSnLTbnFvZkI",
    authDomain: "customer-emotion-detection.firebaseapp.com",
    projectId: "customer-emotion-detection",
    storageBucket: "customer-emotion-detection.appspot.com",
    messagingSenderId: "740818046433",
    appId: "1:740818046433:web:a5a0027392d8acb39b56a0",
    measurementId: "G-XFRCL2FWNT"
};
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, auth, storage }
