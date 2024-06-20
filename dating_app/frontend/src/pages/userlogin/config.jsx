
import { initializeApp } from "firebase/app";

import {getAuth,GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyA7e-mZlIRJHCdvGgWh_1YFrYBcl2tRg2A",
  authDomain: "learnbuds-c099f.firebaseapp.com",
  projectId: "learnbuds-c099f",
  storageBucket: "learnbuds-c099f.appspot.com",
  messagingSenderId: "923661769848",
  appId: "1:923661769848:web:24c4d34d6f79ee8630a18d",
  measurementId: "G-XWC15LGPQ0"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {auth,provider};