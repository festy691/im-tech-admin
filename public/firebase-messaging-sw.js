importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyDNgMkkqd1IZp7eTZ5XIlMeypAG514amh4",
  authDomain: "im-card.firebaseapp.com",
  projectId: "im-card",
  storageBucket: "im-card.appspot.com",
  messagingSenderId: "945669960947",
  appId: "1:945669960947:web:0d3d68ce33e4fc67f43386",
  measurementId: "G-SSV81993TR"
});

const messaging = firebase.messaging();