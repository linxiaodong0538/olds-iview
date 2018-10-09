export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/videos',
  component: resolve => require(['@/pages/Videos'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Videos/List'], resolve)
    }
  ]
}
