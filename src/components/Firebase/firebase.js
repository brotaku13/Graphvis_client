import app from 'firebase/app'
import firebase from 'firebase/app'
import 'firebase/auth'


const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DB,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.googleAuth = new firebase.auth.GoogleAuthProvider()
    }

    doLoginWithPopup = (provider) => this.auth.signInWithPopup(provider)
    doSignOut = () => this.auth.signOut();
}
export default Firebase;