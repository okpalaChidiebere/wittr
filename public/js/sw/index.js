self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request).then(function(response) { //a nested fetch request with service worker
        if (response.status === 404) {
          // TODO: instead, respond with the gif at
          // /imgs/dr-evil.gif
          // using a network request
          return fetch('/imgs/dr-evil.gif')
          //return new Response("Whoops, not found");
        }
        return response;
      }).catch(function() {
        return new Response("Uh oh, that totally failed!");
      })
      //customFetch (event.request)
    );
    
});
const customFetch = async (request) => {
    try{
        const response = await fetch(request)
        /*const { status } = response
        if (status === 404) {
              return await fetch('/imgs/dr-evil.gif')
        }*/
        console.log(response)
        return response
    }catch(e){
        return new Response("Uh oh, that totally failed!");
    }
  }