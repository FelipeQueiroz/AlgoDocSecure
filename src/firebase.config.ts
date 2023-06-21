// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCR5O3DJ8SWAZBLFRSKAo7dicjqIBW_7z4",
    authDomain: "algodoc-d3991.firebaseapp.com",
    projectId: "algodoc-d3991",
    storageBucket: "algodoc-d3991.appspot.com",
    messagingSenderId: "382932007322",
    appId: "1:382932007322:web:9ea8e0f8990d228dc46223"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;