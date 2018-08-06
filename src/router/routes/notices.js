export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/notices',
  component: resolve => require(['@/modules/Notices'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/modules/Notices/List'], resolve)
    }
  ]
}
