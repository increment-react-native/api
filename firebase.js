import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAYi5FC6VwZ1IFoY7dbtiOEAGFguQ8SL4Y",
    authDomain: "kicktronics-28008.firebaseapp.com",
    databaseURL: "https://kicktronics-28008.firebaseio.com",
    projectId: "kicktronics-28008",
    storageBucket: "kicktronics-28008.appspot.com",
    messagingSenderId: "381933322706",
    appId: "1:381933322706:ios:5e0ec8cb64540a5b"
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();

export default firebase;