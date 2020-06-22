self.addEventListener('notificationclick', function(event) {
	console.log('On notification click: ', event.notification);
	event.notification.close();
	
	// This looks to see if the current is already open and
	// focuses if it is
	event.waitUntil(self.clients.matchAll({
		type: "window",
		includeUncontrolled: true
	}).then(function(clientList) {
		
		for (var i = 0; i < clientList.length; i++) {
			var client = clientList[i];
			if (client.url.startsWith(self.location.origin) && 'focus' in client)
				return client.focus();
		}
		if (self.clients.openWindow)
			return self.clients.openWindow(self.location.origin);
	}));
});

importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-messaging.js');


firebase.initializeApp({
	// Project Settings => Add Firebase to your web app
	apiKey: "AIzaSyA66bXAnLoobmiwEj3j6RYt--WcvOLge5s",
	authDomain: "pronto-entregue.firebaseapp.com",
	databaseURL: "https://pronto-entregue.firebaseio.com",
	projectId: "pronto-entregue",
	storageBucket: "pronto-entregue.appspot.com",
	messagingSenderId: "643888213114",
	appId: "1:643888213114:web:36c142c8af7d7a62685fc3",
	measurementId: "G-B0F9GJ2H7L"
});

//firebase.analytics();

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
	
	// Customize notification here
	
	const data = payload.webPush ? { ...payload.webPush.notification, ...payload.notification } : payload.notification;
	
	const notificationTitle = data.title;
	const notificationOptions = {
		body: data.body,
		sound: 'https://storage.googleapis.com/assets-pronto-entregue/notification.ogg',
		...data,
		//icon: 'https://www.prontoentregue.com.br/icon-bkp.png'
	};
	
	return self.registration.showNotification(notificationTitle, notificationOptions);
});

/* messaging.setBackgroundMessageHandler(function(payload) {
	const promiseChain = clients
	.matchAll({
		type: "window",
		includeUncontrolled: true
	})
	.then(windowClients => {
		for (let i = 0; i < windowClients.length; i++) {
			const windowClient = windowClients[i];
			windowClient.postMessage(payload);
		}
	})
	.then(() => {
		return registration.showNotification("my notification title");
	});
	return promiseChain;
});

self.addEventListener('notificationclick', function(event) {
	// do what you want
	// ...
}); */