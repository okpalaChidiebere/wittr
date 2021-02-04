const staticCacheName = 'wittr-static-v2' //having the cache name to be a variable will help this be more scallable

self.addEventListener('install', function(event) {
  event.waitUntil(
    // TODO: change the site's theme, eg swap the vars in public/scss/_theme.scss
    // Ensure at least $primary-color changes
    // TODO: change cache name to 'wittr-static-v2'
    caches.open(staticCacheName).then(function(cache) { 
      return cache.addAll([
        '/',
        'js/main.js',
        'css/main.css',
        'imgs/icon.png',
        'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
        'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
      ]);
      /*
      best practise
      In production have versioning for your resource and not the version name eg
      [
        '/',
        'js/main-a4929ce.js', //
        'css/main-2fee7ea.css',
        'imgs/icon-5012ac1.png',
        'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
        'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
      ]
      then give these resources a cache time of a year or more. So if you update your css(eg from css/main-2fee7ea.css to css/main-2fee564.css), a build script(eg npm run build for react)
      could automatically update your service worker changing the url to the new CSS

      Not too good practise
      you can also choose to have the cache name to be autogenerated based on the things it caches
      staticCacheName = 'wittr-static-84efb8'
      But versioning like this and giving then a long cache time is not advisable specific to service workers.
      Remeber the good caching practise is to have short cache time.
      Also with this practise, you have to fetch all the resources again. :(


      Looking at the 'best practise', if you just change the css resource name, the css url changes, therefore the cache name changes
      Therefore when the browser fetches all of these, it can get everything other than the CSS from the browser cache because they have not changed.
      The only thing that get fetched from the network again is just that new css url chnaged
      */
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    // TODO: remove the old cache
    //we remove the old cache(version 1) here, so that it will not disrupt the current running version of the site
    caches.keys().then(function(cacheNames){
        cacheNames.filter(function(cacheName){
            //we remove all the caches that we dont need. Note checking the cache that starts with 'wittr-' ensures we dont delete the cache from other apps that might be running on thesame origin
            return cacheName.startsWith('wittr-') && cacheName !== staticCacheName 
        }).map(function(cacheName){
            return cache.delete(cacheName)
        })
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});