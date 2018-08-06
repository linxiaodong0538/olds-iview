export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/permissions',
  component: resolve => require(['@/modules/Permissions'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/modules/Permissions/List'], resolve)
    }
  ]
}
