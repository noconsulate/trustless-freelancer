import firebase from "firebase/app";
require("firebase/database");
require("firebase/auth");

var firebaseConfig = {
  apiKey: "AIzaSyDoMp7MjiJh35SveFuI-064sQ1J2z4Ej3s",
  authDomain: "freelancer-40250.firebaseapp.com",
  databaseURL: "https://freelancer-40250-default-rtdb.firebaseio.com",
  projectId: "freelancer-40250",
  storageBucket: "freelancer-40250.appspot.com",
  messagingSenderId: "15869209298",
  appId: "1:15869209298:web:9904c5e8c9bd40db831b0b",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const database = firebase.database;
export const fbAuth = firebase.auth;
