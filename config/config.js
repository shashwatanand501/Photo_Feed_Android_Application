import firebase from 'firebase';

const Config = {
    apiKey: "AIzaSyAaSBDv5eDGbwod77CMFAS6ZIubjWBHuHg",
    authDomain: "blog-8144b.firebaseapp.com",
    databaseURL: "https://blog-8144b.firebaseio.com",
    projectId: "blog-8144b",
    storageBucket: "blog-8144b.appspot.com",
    messagingSenderId: "195228983485",
    appId: "1:195228983485:web:dc1509797c0557dda157d4",
    measurementId: "G-RC57022M7X"
  };
  firebase.initializeApp(Config)

  export const f = firebase;
  export const database = firebase.database();
  export const auth = firebase.auth();
  export const storage = firebase.storage();