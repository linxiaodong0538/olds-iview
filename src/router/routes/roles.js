export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/roles',
  component: resolve => require(['@/pages/Roles'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Roles/List'], resolve)
    }
  ]
}
