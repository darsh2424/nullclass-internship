
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcJgCHDRGUqN70ZUq--PayV3Y8vv0JQVo",
  authDomain: "twitter-clone-nullclass.firebaseapp.com",
  projectId: "twitter-clone-nullclass",
  storageBucket: "twitter-clone-nullclass.firebasestorage.app",
  messagingSenderId: "88107880837",
  appId: "1:88107880837:web:6502947890996c301d74ec",
  measurementId: "G-YGKBS09LWY"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export default app
// const analytics = getAnalytics(app);
