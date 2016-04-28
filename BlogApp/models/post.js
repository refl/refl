const Blog = require('refl').Blog
const attr = require('refl').attr
const moment = require('moment')

Blog.model('Post', {
  tableName: 'posts',
  attributes: {
    title: attr('string').required(),
    body: attr('string').requried(),
    published_at: attr('timestamp').required().default(() => {
      return moment.now()
    }),
    author: belongsTo(Blog.model('User')).required(),
  },
  isPublished: (post) => {
    return post.published_at >= moment.now()
  }
})
