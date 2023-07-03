import firebase from "firebase/app";
import "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDNgMkkqd1IZp7eTZ5XIlMeypAG514amh4",
  authDomain: "im-card.firebaseapp.com",
  projectId: "im-card",
  storageBucket: "im-card.appspot.com",
  messagingSenderId: "945669960947",
  appId: "1:945669960947:web:0d3d68ce33e4fc67f43386",
  measurementId: "G-SSV81993TR"
};

var fbase = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
// Initialize Firebase
//firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = fbase.messaging();

export default messaging; 