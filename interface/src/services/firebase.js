import firebase from "firebase/app";
require("firebase/database");

var firebaseConfig = {
  apiKey: "AIzaSyBkFjxOXeMQnbbILEefVO9AzAJUrq9foL4",
  authDomain: "trustless-freelancer.firebaseapp.com",
  databaseURL: "https://trustless-freelancer.firebaseio.com",
  projectId: "trustless-freelancer",
  storageBucket: "trustless-freelancer.appspot.com",
  messagingSenderId: "182918380299",
  appId: "1:182918380299:web:3c14aef97693f9680e000e",
  measurementId: "G-M8N6142TKP",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const database = firebase.database;
firebase
  .database()
  .ref("/login_nonces/0x935A3dE3217D9BB58C24343600f655141d118aeB")
  .once("value")
  .then((snapshot) => {
    console.log(snapshot.val());
  });
