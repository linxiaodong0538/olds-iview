export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/olds',
  component: resolve => require(['@/modules/Olds'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/modules/Olds/List'], resolve)
    },
    {
      path: 'index/form/:id?',
      component: resolve => require(['@/modules/Olds/Form'], resolve)
    }
  ]
}
