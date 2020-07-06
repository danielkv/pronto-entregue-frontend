import * as firebase from "firebase/app";

import client from '../services/apolloClient';

import "firebase/messaging";
import { LOGGED_USER_ID } from "../graphql/authentication";
import { PUSH_NOTIFICATION_TOKEN, REMOVE_NOTIFICATION_TOKEN } from "../graphql/users";

class NotificationsControl {
	constructor () {
		this.permission = '';
		this.messaging = null;
		this.firebaseApp = null;
		this.token = null;
		this.setMonitor = false;
		this.messageHandlers=[]
	}

	register() {
		this.initializeApp()
	}

	initializeApp() {
		this.firebaseApp = firebase.initializeApp({
			apiKey: "AIzaSyA66bXAnLoobmiwEj3j6RYt--WcvOLge5s",
			authDomain: "pronto-entregue.firebaseapp.com",
			databaseURL: "https://pronto-entregue.firebaseio.com",
			projectId: "pronto-entregue",
			storageBucket: "pronto-entregue.appspot.com",
			messagingSenderId: "643888213114",
			appId: "1:643888213114:web:36c142c8af7d7a62685fc3",
			measurementId: "G-B0F9GJ2H7L"
		});
		const messaging = this.firebaseApp.messaging();

		messaging.usePublicVapidKey('BIk5mdYSTvNqV_wuQmPm6FEtHfIZ3yp6iTmgpCPWVFwtJywlFSnZ3L_7nQnnPipvo2A2ryvpkJ2HIywWOCyrRjg')

		this.messaging = messaging;

		messaging.onMessage((payload)=> {
			this.messageHandlers.forEach(handler => {
				handler.handler(payload);
			})
		})

		return messaging
	}

	addHandler(id, handler) {
		const newHandler = { id, handler };
		this.messageHandlers.push(newHandler);

		return newHandler;
	}

	removeHandler(id) {
		const handlerIndex = this.messageHandlers.findIndex(h => h.id === id);
		return this.messageHandlers.splice(handlerIndex, 1);
	}

	saveToken(token) {
		const { loggedUserId } = client.readQuery({ query: LOGGED_USER_ID });
		return client.mutate({ mutation: PUSH_NOTIFICATION_TOKEN, variables: { userId: loggedUserId, token } })
	}

	removeToken(token) {
		return client.mutate({ mutation: REMOVE_NOTIFICATION_TOKEN, variables: { token } })
	}

	monitorToken() {
		if (this.setMonitor) return;
		this.setMonitor = true;

		this.messaging.onTokenRefresh(()=>{
			this.removeToken(this.token)
				.then(()=>{
					this.getToken()
				})
		})
	}

	async getToken() {
		try {
			if (this.permission === 'granted') return this.token;

			await this.messaging.requestPermission()

			this.permission = 'granted';
			this.token = await this.messaging.getToken();

			this.saveToken(this.token);

			this.monitorToken();

			return this.token;
		} catch(err) {
			this.permission = 'denied'
			console.log("Unable to get permission to notify.", err);
		}
	}
}

const NotificationsController = new NotificationsControl();

export default NotificationsController;