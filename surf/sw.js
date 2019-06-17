let swCache = 'opensurf-sw-v1.2';

self.addEventListener('install', event => {

  // console.log('SW Install Event');
  // console.log(event);

  event.waitUntil(
    caches.open(swCache).then(cache => {
      return cache.addAll([
        './assets/css/bootstrap.min.css',
        './assets/icon/apple-icon-57x57.png',
        './assets/icon/apple-icon-60x60.png',
        './assets/icon/apple-icon-72x72.png',
        './assets/icon/apple-icon-76x76.png',
        './assets/icon/apple-icon-114x114.png',
        './assets/icon/apple-icon-120x120.png',
        './assets/icon/apple-icon-144x144.png',
        './assets/icon/apple-icon-152x152.png',
        './assets/icon/apple-icon-180x180.png',
        './assets/icon/android-icon-36x36.png',
        './assets/icon/android-icon-48x48.png',
        './assets/icon/android-icon-72x72.png',
        './assets/icon/android-icon-96x96.png',
        './assets/icon/android-icon-144x144.png',
        './assets/icon/android-icon-192x192.png',
	      './assets/icon/favicon-16x16.png',
        './assets/icon/favicon-32x32.png',
        './assets/icon/favicon-96x96.png',
        './assets/icon/ms-icon-70x70.png',
        './assets/icon/ms-icon-144x144.png',
        './assets/icon/ms-icon-150x150.png',
        './assets/icon/ms-icon-310x310.png',
        './assets/js/bootstrap.min.js',
        './assets/js/clappr-youtube-playback.js',
        './assets/js/clappr-chromecast-plugin.js',
        './assets/js/clappr.min.js',
        './assets/js/jquery-3.4.1.min.js',
        './assets/js/popper.min.js',
        './assets/js/rtmp.min.js'
      ]).then(() => self.skipWaiting())
    })
  );
});

self.addEventListener('activate',  event => {

  // console.log('SW Activate Event');
  // console.log(event);

  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {

  // console.log('SW Fetch Event');
  // console.log(event);

  event.respondWith (
    caches.match(event.request, {ignoreSearch:true, ignoreMethod:true, ignoreVary:true, cacheName:swCache}).then(response => {
      return response || fetch(event.request);
    })
  )
});

self.addEventListener('push', function(event) {

  // console.log('SW Push Event');
  // console.log(event);

  try {

    if (!event.data) {
      throw 'No Push Data';
    }

    dataJson = JSON.parse(event.data.text());

    if (!dataJson.title) {
      throw 'No Push Data Title';
    }

    if (!dataJson.body) {
      throw 'No Push Data Body';
    }

    event.waitUntil(
      self.registration.showNotification(dataJson.title, dataJson)
    );

  } catch (e) {

    console.log('Push Data Error:', e);
  }
});

self.addEventListener('notificationclick', function(event) {

  // console.log('SW Notification Click Event');
  // console.log(event);

  event.notification.close();

  try {

    if (!event.notification.data) {
      throw 'No Push Data';
    }

    if (!event.notification.data.url) {
      throw 'No Push Data URL';
    }

    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );

  } catch (e) {

    console.log('Push Data Error:', e);
  }
});
