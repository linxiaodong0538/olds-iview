export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/notices',
  component: resolve => require(['@/pages/Notices'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Notices/List'], resolve)
    }
  ]
}
