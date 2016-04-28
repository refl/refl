const Blog = require('refl').Blog

Blog.router.pipeline('web', [
    Blog.router.accepts('html'),
    Blog.router.fetchSession,
    Blog.router.fetchFlash,
    Blog.router.secureHeaderBrowsers,
])

Blog.router.scope(scope => {
  scope.pipeThrough('web')

  scope.get('/home', conn => {
    conn.render("home")
  })

  scope.resources('posts', Blog.Controller.Posts)
  scope.resources(['posts', 'comments'], Blog.Controller.Comments)
})
