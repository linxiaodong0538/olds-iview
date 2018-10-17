export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/messages',
  component: resolve => require(['@/pages/Messages'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Messages/List'], resolve)
    }
  ]
}
