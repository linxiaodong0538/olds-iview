export default {
  path: ':prefix/:alias/products',
  component: resolve => require(['@/modules/Products'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/modules/Products/List'], resolve)
    },
    {
      path: 'index/form/:id?',
      component: resolve => require(['@/modules/Products/Form'], resolve)
    },
    {
      path: 'categories',
      component: resolve => require(['@/modules/Categories/List'], resolve)
    }
  ]
}
