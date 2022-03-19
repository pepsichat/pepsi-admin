import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDBCB00CkxHXwiAxqtj369EKv5M5OCgslc",
    authDomain: "pepsi-coolerfan-chat-2d9ab.firebaseapp.com",
    databaseURL: "gs://pepsi-coolerfan-chat-2d9ab.appspot.com",
    projectId: "pepsi-coolerfan-chat-2d9ab",
    storageBucket: "pepsi-coolerfan-chat-2d9ab.appspot.com",
    messagingSenderId: "967346529141",
    appId: "1:967346529141:web:87311021ef0ced75a9e93c"
};
let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage};
