export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/articles',
  component: resolve => require(['@/pages/Articles'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Articles/List'], resolve)
    },
    {
      path: 'index/form/:id?',
      component: resolve => require(['@/pages/Articles/Form'], resolve)
    },
    {
      path: 'categories',
      component: resolve => require(['@/pages/Categories/List'], resolve)
    }
  ]
}
