self.addEventListener('fetch', function(event) {
	// TODO: respond to all requests with an html response
	// containing an element with class="a-winner-is-me".
	// Ensure the Content-Type of the response is "text/html"
  //console.log(event.request);
  event.respondWith(
      new Response('<p class="a-winner-is-me"> Hello Winner </p>', {
          headers: {
              'Content-Type': 'text/html', //this is important to display html in our page
              'foo': 'bar' //we will not use this. But you can see that it is passed to our header in the network tab 
          }
      })
  )
});