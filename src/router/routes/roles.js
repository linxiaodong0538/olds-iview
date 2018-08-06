export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/roles',
  component: resolve => require(['@/modules/Roles'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/modules/Roles/List'], resolve)
    }
  ]
}
