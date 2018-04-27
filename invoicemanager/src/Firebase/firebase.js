import * as firebase from 'firebase';

const config = {
apiKey: "AIzaSyDOAtWNyCNGoeUuEHPhQi24Ceu-nnHkG34",
authDomain: "invoice-manager-be193.firebaseapp.com",
databaseURL: "https://invoice-manager-be193.firebaseio.com",
projectId: "invoice-manager-be193",
storageBucket: "invoice-manager-be193.appspot.com",
messagingSenderId: "393265823448"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();

export {
  auth,
};