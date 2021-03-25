// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/8.3.1/firebase-analytics.js"></script>

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA3M00jcOJRTy6WzZ9RDqIz1tGHOiTL6as',
  authDomain: 'tourism-68046.firebaseapp.com',
  projectId: 'tourism-68046',
  storageBucket: 'tourism-68046.appspot.com',
  messagingSenderId: '505708546193',
  appId: '1:505708546193:web:e33bc18b1a05d43c72d730',
  measurementId: 'G-D21VC5C7GC',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase: {
  config: {
    apiKey: process.env.FIREBASE_API_KEY || fatal('No FIREBASE_API_KEY'),
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || fatal('No FIREBASE_AUTH_DOMAIN'),
    projectId: process.env.FIREBASE_PROJECT_ID || fatal('No FIREBASE_PROJECT_ID'),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || fatal('No FIREBASE_STORAGE_BUCKET'),
    messagingSenderId:
      process.env.FIREBASE_MESSAGING_SENDER_ID || fatal('No FIREBASE_MESSAGING_SENDER_ID'),
    appId: process.env.FIREBASE_APP_ID || fatal('No FIREBASE_APP_ID'),
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || fatal('No FIREBASE_MEASUREMENT_ID'),
  },
},

# Firebase
FIREBASE_API_KEY=********
FIREBASE_AUTH_DOMAIN=********
FIREBASE_PROJECT_ID=********
FIREBASE_STORAGE_BUCKET=********
FIREBASE_MESSAGING_SENDER_ID=********
FIREBASE_APP_ID=********
FIREBASE_MEASUREMENT_ID=********
