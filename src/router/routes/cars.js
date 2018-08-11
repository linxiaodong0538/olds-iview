export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/cars',
  component: resolve => require(['@/pages/Cars'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Cars/List'], resolve)
    },
    {
      path: 'index/form/:id?',
      component: resolve => require(['@/pages/Cars/Form'], resolve)
    }
  ]
}
