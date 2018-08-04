export default {
  path: ':topLevelMenu/:secondLevelMenu/settings',
  component: resolve => require(['@/modules/Settings'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/modules/Settings/Form'], resolve)
    }
  ]
}
