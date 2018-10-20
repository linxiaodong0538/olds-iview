export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/videos',
  component: resolve => require(['@/pages/Videos'], resolve),
  children: [
    {
      path: ':oldId',
      component: resolve => require(['@/pages/Videos/List'], resolve)
    }
  ]
}
