export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/permissions',
  component: resolve => require(['@/pages/Permissions'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Permissions/List'], resolve)
    }
  ]
}
