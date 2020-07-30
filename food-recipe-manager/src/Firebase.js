import Firebase from 'firebase/app';
import 'firebase/database'
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBmDCvnhq1XVEWTjN6JQCTut6uSquvWN7c",
    authDomain: "foodrecipemanager.firebaseapp.com",
    databaseURL: "https://foodrecipemanager.firebaseio.com",
    projectId: "foodrecipemanager",
    storageBucket: "foodrecipemanager.appspot.com",
    messagingSenderId: "868868305830",
    appId: "1:868868305830:web:f98c758dc68ba18f541567"
};

Firebase.initializeApp(firebaseConfig);

export const auth = Firebase.auth();
export default Firebase;