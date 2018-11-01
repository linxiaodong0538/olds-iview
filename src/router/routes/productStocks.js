export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/productStocks',
  component: resolve => require(['@/pages/ProductStocks'], resolve),
  children: [
    {
      path: ':oldId',
      component: resolve => require(['@/pages/ProductStocks/List'], resolve)
    }
  ]
}
