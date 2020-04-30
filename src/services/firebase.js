import firebase from 'firebase/app';
import '@firebase/messaging';

const config = {
    messagingSenderId: '<your-app-messaging-sender-id>'
};

firebase.initializeApp(config);

let messaging;

// we need to check if messaging is supported by the browser
if(firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
}

export {
    messaging
};