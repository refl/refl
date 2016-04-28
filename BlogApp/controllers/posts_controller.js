const Blog = require('refl').Blog
const Post = Blog.model('Post')

Blog.controller('PostsController', {
  index: (conn) => {
    Post.all().then(posts => {
      conn.render('posts.index', {posts: posts})
    })
  },
  create: (conn) => {
    let post = conn.params()
    Post.save(post).then(post => {
    }).catch(err => {
    })
  },
  store: (conn) => {
  },
  show: (conn) => {
  },
  edit: (conn) => {
  },
  update: (conn) => {
  },
  destroy: (conn) => {
  }
})
