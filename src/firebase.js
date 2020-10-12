import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyD4sbl_55dTHQYD-tGzp6bg0BtWH29rdxQ",
    authDomain: "react-slack-6ec61.firebaseapp.com",
    databaseURL: "https://react-slack-6ec61.firebaseio.com",
    projectId: "react-slack-6ec61",
    storageBucket: "react-slack-6ec61.appspot.com",
    messagingSenderId: "1075299343851",
    appId: "1:1075299343851:web:ced971f3356b4f89ea0dae"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;