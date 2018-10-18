export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/comments',
  component: resolve => require(['@/pages/Comments'], resolve),
  children: [
    {
      path: ':videoId',
      component: resolve => require(['@/pages/Comments/List'], resolve)
    }
  ]
}
