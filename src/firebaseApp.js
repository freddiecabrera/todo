import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBZHMrghQaOkR7m0KD8zZVoE0wln9g1OPI",
    authDomain: "ying-86c59.firebaseapp.com",
    databaseURL: "https://ying-86c59.firebaseio.com",
    projectId: "ying-86c59",
    storageBucket: "ying-86c59.appspot.com",
    messagingSenderId: "828043588057"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig); // Initialize firebase
export default firebaseApp;