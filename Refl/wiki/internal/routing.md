# Refl's routing architecture

We're all used to routing. We all know a little bit about REST and it's
specification. Routing *feels* similar in a lot of frameworks and libraries, 
such as:

* [Rails](http://rubyonrails.org/)
* [Laravel](http://laravel.com)
* [Phoenix](http://phoenixframework.org)
* [Express](http://expressjs.com)
* [Django](http://djangoproject.com)

Refl is no different. We provide simple yet powerful functions to declare our
application's routing. The following code shows an overview of the routing API:

```javascript
const Refl = require('Refl'),
      MyApp = Refl.app('MyApp'),
      router = MyApp.router;

router.pipeline('web', [
    router.accepts('html'),
    router.fetchSession,
    router.fetchFlash,
    router.putSecureBrowserHeaders,
])

router.scope(scope => {
    scope.pipeThrough('web')

    scope.get('/dashboard', conn => {
        conn.render('dashboard')
    })
})
```
