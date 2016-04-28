const Blog = require('refl').Blog

Blog.model('User', {
  tableName: 'users',
  attributes: {
    name: attr('string').required(),
    email: attr('string').required(),
    posts: hasMany(Blog.model('Post')),
  },
})
