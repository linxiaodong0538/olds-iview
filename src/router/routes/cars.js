export default {
  path: ':prefix/:alias/cars',
  component: resolve => require(['@/modules/Cars'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/modules/Cars/List'], resolve)
    },
    {
      path: 'index/form/:id?',
      component: resolve => require(['@/modules/Cars/Form'], resolve)
    }
  ]
}
