export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/families',
  component: resolve => require(['@/modules/Families'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/modules/Families/List'], resolve)
    },
    {
      path: 'index/form/:id?',
      component: resolve => require(['@/modules/Families/Form'], resolve)
    }
  ]
}
