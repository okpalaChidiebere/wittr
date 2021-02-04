/*
Here we get a log for every event made by the page for css, images, js, event requests from other origins

You can mess around with this requests. Changing Headers or responding with something entirely different.

When a user navigates to a page within your service worker scope, the service worker
controls it. The network requests for its HTML goes to the service worker and triggers a fetch event
You also get a fetch event triggered by that page. eg fetch event for css, js, images. Even if
the requests to other origins

You can inspect all these fetch event with JS!
*/

self.addEventListener('fetch', function(event) {
  console.log(event.request); //we get log of every fetch request made by this page. The CSS, JS, images, even request to other origins fot fonts
});

/*
At this point it took two page refreshes to see the logs for this requests because we did not hook this log to any
of the service worker lifecycle. This is because requests load the first page loaded all fetch requests for images, 
css, js then finally ran our code to register the service worker. So before the first page loaded there was not Service Worker that existed.
The Serviceworker just got regiestered in the first refresh. So this first page requests will by pass the service worker though it is there

After we hit refresh, Our service worker is up and running at this point. The second page loaded when we had registered the service worker by the first refresh already. 
so we can now see the logs of requests the service worker intercepted 
NOTE: the endpoint is thesame and visibly to the user the page is thesame, but behind the scenes they are two different pages

Good Practise is to keep the cache time for your service worker short. You can go as low as zero for your service worker project
as the instructor says he does which is what this witrr app uses. If you set your service worker script to cache for more than a day
the browser will ignore that and set your cache to 24hrs. You service worker will still work if you cache it for over 24hrs, but the browser
will by pass the browser cache and go straight to the network, if your srvice worker is over a day old
*/