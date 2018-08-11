export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/olds',
  component: resolve => require(['@/pages/Olds'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Olds/List'], resolve)
    },
    {
      path: 'index/form/:id?',
      component: resolve => require(['@/pages/Olds/Form'], resolve)
    }
  ]
}
