import firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";
require("firebase/database");
require("firebase/auth");
import Web3 from "web3";
const axios = require("axios").default;

const { fbApiKey } = require("../../../secrets.json");

const URL = "https://us-central1-freelancer-40250.cloudfunctions.net/";

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

// sign, verify, and login
export async function signAndVerify() {
  // get nonce
  const user = window.ethereum.selectedAddress.toLowerCase();

  const ref = database().ref("users/" + user);
  let nonce;

  const snap = await ref.once("value");
  const value = snap.val();
  if (value) {
    nonce = value.nonce;
    console.log(nonce);
  } else {
    // address has no nonce, create new user entry in db
    nonce = uuidv4();
    await ref.update({ nonce: nonce });
  }

  // sign the nonce with metamask
  const web3 = new Web3(window.ethereum);
  const message = "words";

  const signature = await web3.eth.personal.sign(
    web3.utils.fromUtf8(`words ${nonce}`),
    window.ethereum.selectedAddress
  );

  console.log(signature);

  // verify signature with database
  let token;
  console.log(user);
  axios
    .post(URL + `verify?address=${user}&signature=${signature}`)
    .then((res) => {
      token = res.data.token;
      console.log(token);
      return token;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}
