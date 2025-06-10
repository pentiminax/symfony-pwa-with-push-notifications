import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    async connect() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            return;
        }

        await this.askPermission();

        const registration = await this.getOrRegisterServiceWorker();

        const subscription = await this.getOrSubscribeUser(registration);

        await this.sendPushNotification(subscription);
    }

    async getOrSubscribeUser(registration) {
        const existingSubscription = await registration.pushManager.getSubscription();

        if (existingSubscription) {
            console.log('[Push] Already subscribed');

            console.log(existingSubscription);
            console.log(existingSubscription.toJSON().keys);

            return existingSubscription;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BJ2p_D5hC3P_Ctlpf5p3Ys8gP4xf8qWiK8YzOyfayZBcnPxWdDP3hHmopA9sjmaJhXUQuHW8q9IL3xf2V2o2gDM'
        });

        console.log('[Push] New subscription');

        return subscription;
    }

    askPermission() {
        return new Promise(function(resolve, reject) {
            const permissionResult = Notification.requestPermission(function(result) {
                resolve(result);
            });

            if (permissionResult) {
                permissionResult.then(resolve, reject);
            }
        })
            .then(function(permissionResult) {
                if (permissionResult !== 'granted') {
                    throw new Error('We weren\'t granted permission.');
                }
            });
    }

    async getOrRegisterServiceWorker() {
        let registration = await navigator.serviceWorker.getRegistration();

        if (!registration) {
            registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('[SW] Registered');
        } else {
            console.log('[SW] Already registered');
        }

        return registration;
    }

    async sendPushNotification(pushSubscription) {
        const body = {
            endpoint: pushSubscription.endpoint,
            keys: {
                p256dh: pushSubscription.toJSON().keys.p256dh,
                auth: pushSubscription.toJSON().keys.auth,
            }
        };

        await fetch('/notifications/push', {
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });
    }
}
