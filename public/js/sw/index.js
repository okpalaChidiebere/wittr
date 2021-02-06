self.addEventListener('fetch', function(event) {
  console.log(event.request);
  //console.log('Hello World');
});

/*Any slight change to this file, will cause a new service worker to be created in the background and wait for the 
existing used sw to be freed from all pages before i can take over

Reloading the page while holding shift will make the new updated service worker in background take over. It is kinda
like force load :) */