import firebase from "firebase/app";
require("firebase/database");
require("firebase/auth");

const { fbApiKey } = require("../../../secrets.json");

var firebaseConfig = {
  apiKey: "AIzaSyDoMp7MjiJh35SveFuI-064sQ1J2z4Ej3s",
  authDomain: "freelancer-40250.firebaseapp.com",
  databaseURL: "https://freelancer-40250-default-rtdb.firebaseio.com",
  projectId: "freelancer-40250",
  storageBucket: "freelancer-40250.appspot.com",
  messagingSenderId: "15869209298",
  appId: fbApiKey,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const database = firebase.database;
export const auth = firebase.auth;
