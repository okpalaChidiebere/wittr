# Wittr

This is a silly little demo app for an offline-first course.

You could run the app either using machine dependnecies, or using docker

## Running using local machine

### Installing

Dependencies:

* [Node.js](https://nodejs.org/en/) v0.12.7 or above

Then check out the project and run:

```sh
npm install
```

### Running

```sh
npm run serve
```

### Using the app

You should now have the app server at [localhost:8888](http://localhost:8888) and the config server at [localhost:8889](http://localhost:8889).

You can also configure the ports:

```sh
npm run serve -- --server-port=8000 --config-server-port=8001
```

## Running using docker

```sh
docker-compose up
```

Here also you should have the app server at [localhost:8888](http://localhost:8888) and the config server at [localhost:8889](http://localhost:8889).

You can configure the ports by changing them in `docker-compose.yml` before starting:

```yml
ports:
  # <host>:<container>
  - 8000:8888
  - 8001:8889
```

## Troubleshooting

* Errors while executing `npm run serve`.
  * The first thing to try is to upgrade to latest version of node.
  * If latest version also produces errors, try installing v4.5.0.
    * An easy fix for that would be [to use `nvm`](http://stackoverflow.com/a/7718438/1585523).
* If you get any node-sass errors, try running `npm rebuild node-sass --force` or the remove `node_modules` folder and run `npm install` again


## Branches for this project in order

```sh
task-register-sw
```
(Registering service worker in your project)

You can have service worker control just certain parts of your site as well/ eg
```js
navigator.serviceWorker.register('/sw.js', {scope: '/foo/'}); 
```

Service worker will control path like
`/foo/bar

/foo/bar/index.html

/foo/ `

### Service worker Dev Tools
```sh 
log-requests
``` 
(observing all request to your site go through the sw and also manually allowing new service worker to take over not by refreshing the page but by onpeing our site in a new browser or opening another site in at hesame tab and going back to our site :(  )

### Hijacking Requests 1
```sh
 task-custom-response 
 ```

### Hijacking Requests 2 (Intercepting all the fetch request for images in our site and returning some evil image LOL)
```sh
 gif-response
  ```

### Hijacking Requests 3 
Returning an error page when the user enters a request for an invalid page
```sh 
error-handling 
```

### Caching Assets four site and installing them
```sh 
task-install 
```
You can see all the resources for your site cached at the 'Cache Storage' in the Application tab :)

### Cache Response
```sh 
task-cache-response 
```
We basically return the cache version of the resource if it is cached otherwise we go fetch the resource from the network

## At this point, if we make edits to our resource and refresh the page so many times, we still get old updates because our resource are static. 


## To complete the rest of the step to full have the app function offline

### We need to come up with a system for unobstrusive app updates
```sh 
task-handling-updates 
```
(users can not get changes like updates to site theme or other new updates to js)

### We want to get the user using the latest version as quickly as possible
```sh 
task-update-notify 
```
(Adding UX to the Update Process. We have a toast notification appearing at this point when there is new updates)

```sh 
task-update-reload
``` 
(Triggering an Update)

```sh 
task-page-skeleton
```
 (We serve page skeleton to our user. We can have our site for production at this point)

From here we go introduced to IndexedDB and Caching
### We should continually update the cache of posts. So that we will not leave the user with the content they were originally with
```sh 
page-skeleton 
```
Getting Started with IDB

```sh 
task-idb-people
```
 More IDB

```sh 
task-idb-store
```
 we created an IDB Storage Object for our app!

```sh
 task-show-stored
 ```
  We added posts to our Storage, the display the posts in the IDB rather than from the network directly

```sh
 task-clean-db
```
 We only let the idb store the most 30 recent posts

### We need to cache the photos
```sh 
task-cache-photos
```

```sh 
task-clean-photos
``` 
Cleaning Photo cache we dont want to keep caching photo we don't need anymore

### We need to cache the avatars
```sh
 task-cache-avatars
``` 
 The main thing to note here is that avatars will change more often than photos for posts so we implemented this a little bit differently


