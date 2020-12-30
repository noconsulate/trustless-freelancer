// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// uuid for nonces
const { v4: uuidv4 } = require("uuid");
// ethereum utility
const ethUtil = require("ethereumjs-util");

exports.addUser = functions.https.onRequest(async (req, res) => {
  const user = req.query.user;
  console.log(user);
  const nonce = uuidv4();
  console.log(nonce);

  const db = admin.database();
  const ref = db.ref(`users/${user}`);

  await ref.set({
    nonce: nonce,
  });

  res.json({ nonce: nonce });
});

exports.getUser = functions.https.onRequest(async (req, res) => {
  const user = req.query.user;

  const db = admin.database();
  const ref = db.ref(`users/${user}`);

  let value, nonce;

  ref.once(
    "value",
    function (snap) {
      console.log(snap.val());
      value = snap.val();
      nonce = value.nonce;

      res.json({ nonce: nonce });
    },
    function (error) {
      console.log(error);
    }
  );
});

exports.verify = functions.https.onRequest(async (req, res) => {
  const publicAddress = req.query.address;
  const signature = req.query.signature;

  const db = admin.database();
  const ref = db.ref(`users/${publicAddress}`);

  ref.once("value", function (snap) {
    const value = snap.val();
    const nonce = value.nonce;
    console.log(nonce);

    const message = "words";

    const msg = `words ${nonce}`;
    console.log(msg);

    const msgHex = ethUtil.fromUtf8(msg);
    const msgBuffer = ethUtil.toBuffer(msgHex);
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    const signatureBuffer = ethUtil.toBuffer(signature);
    const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
    const publicKey = ethUtil.ecrecover(
      msgHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s
    );
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const address = ethUtil.bufferToHex(addressBuffer);

    console.log(address);

    if (address.toLowerCase() === publicAddress.toLowerCase()) {
      console.log("authenticated");

      const uid = address.toLowerCase();
      console.log(uid);
      admin
        .auth()
        .createCustomToken(uid)
        .then((token) => {
          console.log(token);
          res.json({ token });
        })
        .catch(res.json({ error: "firebase auth error" }));

      // assign a new nonce for security
      const newNonce = uuidv4();
      ref.set({
        nonce: newNonce,
      });
    } else {
      console.log("not authenticated");

      //should be a proper http error
      res.json({ message: "authentication failed" });
    }
  });
});
