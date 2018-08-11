export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/families',
  component: resolve => require(['@/pages/Families'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Families/List'], resolve)
    },
    {
      path: 'index/form/:id?',
      component: resolve => require(['@/pages/Families/Form'], resolve)
    }
  ]
}
