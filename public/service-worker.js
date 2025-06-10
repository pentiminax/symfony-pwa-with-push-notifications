self.addEventListener("install", (e) => {
    console.log("[Service Worker] Install");
    console.log(e);
});

self.addEventListener("push", async (e) => {
    console.log("[Service Worker] Push");

    const data = e.data.json();

    let options = {
        icon: '/homescreen192.png'
    }

    options = {...options, ...data.options};

    await self.registration.showNotification(data.title, options);
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    console.log('[SW] notification click - action:', event.action);

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
    } else {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
