export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/products',
  component: resolve => require(['@/pages/Products'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Products/List'], resolve)
    },
    {
      path: 'index/form/:id?',
      component: resolve => require(['@/pages/Products/Form'], resolve)
    },
    {
      path: 'categories',
      component: resolve => require(['@/pages/Categories/List'], resolve)
    }
  ]
}
