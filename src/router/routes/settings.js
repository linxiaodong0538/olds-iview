export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/settings',
  component: resolve => require(['@/pages/Settings'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Settings/Form'], resolve)
    }
  ]
}
