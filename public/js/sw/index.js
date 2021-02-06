var staticCacheName = 'wittr-static-v7';
var contentImgsCache = 'wittr-content-imgs'; ////holds the name of our new image cache
var allCaches = [ //this array holds all cache names we care about
  staticCacheName,
  contentImgsCache
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/skeleton',
        'js/main.js',
        'css/main.css',
        'imgs/icon.png',
        'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
        'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('wittr-') &&
                 !allCaches.includes(cacheName); //delete any cache that is not in the array of caches that we care about
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/skeleton'));
      return;
    }
    if (requestUrl.pathname.startsWith('/photos/')) { //handle photos that are same orign and starts with /photos/
      event.respondWith(servePhoto(event.request)); //when we see any photo as we specified we return to the user whatever our servePhoto methos returns
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

function servePhoto(request) {
  // Photo urls look like:
  // /photos/9-8028-7527734776-e1d2bda28e-800px.jpg
  //Notice te photos have width information at the end
  // But storageUrl has the -800px.jpg bit missing.
  // Use this url to store & match the image in the cache.
  // This means you only store one copy of each photo.
  var storageUrl = request.url.replace(/-\d+px\.jpg$/, ''); //we replced the size at the end of the urls with nothing as our sw cache the image

  // TODO: return images from the "wittr-content-imgs" cache
  // if they're in there. Otherwise, fetch the images from
  // the network, put them into the cache, and send it back
  // to the browser.
  //
  // HINT: cache.put supports a plain url as the first parameter
  return caches.open(contentImgsCache).then(function (cache) { //open our cached images storage
      return cache.match(storageUrl)}).then(function(response) { //we look for a match to the storage URL
        if(response) return response //if there is a match we return it
          //otherwise we fetch the iage from the network using the fetch API
        
        return fetch(request).then(function (networkResponse) {

            return caches.open(contentImgsCache).then(function(cache) {//open our cached images storage
                cache.put(storageUrl, networkResponse.clone()) //we store the clone of the response in the images cache
           
                /*return the original image to be rendered on the browser page
                NOTE: you can only read the response body only once. This is why we have one copy going to the cache and 
                the original copy going to the browser
                */
                return networkResponse 
            })
            
        })
  })

  /*const cache = await caches.open(contentImgsCache)
  const response = await cache.match(storageUrl)
  if(response) return response

  fetch(request).then(function (networkResponse) {
    cache.put(storageUrl, networkResponse.clone()) //we store the clone of the response in the images cache
   
    return networkResponse 
  })*/
}

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});