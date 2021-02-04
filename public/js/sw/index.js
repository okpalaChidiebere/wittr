self.addEventListener('fetch', function(event) {
    // TODO: only respond to requests with a
    // url ending in ".jpg"
    try{
      const { request } = event
      if(request.url.endsWith('.jpg')){
          event.respondWith( //you cannot really destruct this fuction like we did for request becuase this is not a callback but actually a function
              fetch('/imgs/dr-evil.gif')
          )
      }
    }catch(e){
        console.log('it failed')
    }
    
});