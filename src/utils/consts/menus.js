export default [
  {
    icon: 'android-desktop',
    name: 'website',
    title: 'Web 官网',
    children: [
      {
        icon: 'information-circled',
        name: 'website/news',
        title: '企业信息',
        children: [
          {
            title: '分类列表',
            route: '/website/news/news/articles/categories'
          },
          {
            title: '文章列表',
            route: '/website/news/news/articles/index'
          }
        ]
      },
      {
        icon: 'android-contacts',
        name: 'website/contact',
        title: '联系我们',
        children: [
          {
            title: '分类列表',
            route: '/website/contact/contact/articles/categories'
          },
          {
            title: '文章列表',
            route: '/website/contact/contact/articles/index'
          }
        ]
      },
      {
        icon: 'android-settings',
        name: 'website/system',
        title: '系统设置',
        children: [
          {
            title: '网站设置',
            route: '/website/system/settings/settings/index'
          }
        ]
      }
    ]
  },
  {
    icon: 'android-phone-portrait',
    name: 'xhh-app',
    title: '企业 App',
    children: [
      {
        icon: 'ios-briefcase',
        name: 'xhh-app/medicines',
        title: '医疗仓库',
        children: [
          {
            title: '分类列表',
            route: '/xhh-app/medicines/medicines/products/categories'
          },
          {
            title: '产品列表',
            route: '/xhh-app/medicines/medicines/products/index'
          }
        ]
      },
      {
        icon: 'ios-briefcase',
        name: 'xhh-app/cares',
        title: '护理消耗品仓库',
        children: [
          {
            title: '分类列表',
            route: '/xhh-app/cares/cares/products/categories'
          },
          {
            title: '产品列表',
            route: '/xhh-app/cares/cares/products/index'
          }
        ]
      },
      {
        icon: 'android-restaurant',
        name: 'xhh-app/foods',
        title: '食堂仓库',
        children: [
          {
            title: '分类列表',
            route: '/xhh-app/foods/foods/products/categories'
          },
          {
            title: '产品列表',
            route: '/xhh-app/foods/foods/products/index'
          }
        ]
      },
      {
        icon: 'android-restaurant',
        name: 'xhh-app/supplies',
        title: '日用品仓库',
        children: [
          {
            title: '分类列表',
            route: '/xhh-app/supplies/supplies/products/categories'
          },
          {
            title: '产品列表',
            route: '/xhh-app/supplies/supplies/products/index'
          }
        ]
      },
      {
        icon: 'android-restaurant',
        name: 'xhh-app/electricals',
        title: '电器仓库',
        children: [
          {
            title: '分类列表',
            route: '/xhh-app/electricals/electricals/products/categories'
          },
          {
            title: '产品列表',
            route: '/xhh-app/electricals/electricals/products/index'
          }
        ]
      },
      {
        icon: 'android-car',
        name: 'xhh-app/cars',
        title: '车辆',
        children: [
          {
            title: '车辆列表',
            route: '/xhh-app/cars/cars/cars/index'
          }
        ]
      },
      {
        icon: 'person',
        name: 'xhh-app/persons',
        title: '人员',
        children: [
          {
            title: '员工',
            route: '/xhh-app/persons/staffs/staffs/index'
          },
          {
            title: '老人',
            route: '/xhh-app/persons/olds/olds/index'
          },
          {
            title: '家属',
            route: '/xhh-app/persons/families/families/index'
          },
          {
            title: '护工',
            route: '/xhh-app/persons/carers/staffs/index'
          }
        ]
      },
      {
        icon: 'android-warning',
        name: 'xhh-app/notices',
        title: '告警',
        children: [
          {
            title: '车辆',
            route: '/xhh-app/notices/cars/notices/index'
          },
          {
            title: '医疗库存',
            route: '/xhh-app/notices/medicines/notices/index'
          },
          {
            title: '护理消耗品库存',
            route: '/xhh-app/notices/cares/notices/index'
          },
          {
            title: '食堂库存',
            route: '/xhh-app/notices/foods/notices/index'
          },
          {
            title: '日用品库存',
            route: '/xhh-app/notices/supplies/notices/index'
          },
          {
            title: '电器库存',
            route: '/xhh-app/notices/electricals/notices/index'
          }
        ]
      },
      {
        icon: 'android-warning',
        name: 'xhh-app/roles',
        title: '角色权限',
        children: [
          {
            title: '角色列表',
            route: '/xhh-app/roles/roles/roles/index'
          },
          {
            title: '权限列表',
            route: '/xhh-app/roles/permissions/permissions/index'
          }
        ]
      }
    ]
  }
  /*,
  {
    icon: 'android-phone-portrait',
    name: 'xd-app',
    title: '孝道 App',
    children: [
      {
        icon: 'ios-briefcase',
        name: 'xd-app/news',
        title: '重阳画映',
        children: [
          {
            title: '短视频列表',
            route: '/xd-app/news/news/videos/index'
          }
        ]
      },
      {
        icon: 'ios-briefcase',
        name: 'xd-app/olds',
        title: '老人',
        children: [
          {
            title: '老人列表',
            route: '/xd-app/olds/olds/olds/index'
          }
        ]
      },
      {
        icon: 'ios-briefcase',
        name: 'xd-app/my',
        title: '我的',
        children: [
          {
            title: '家属列表',
            route: '/xd-app/my/families/families/index'
          },
          {
            title: '我的消息',
            route: '/website/news/news/articles/index'
          },
          {
            title: '我的评论',
            route: '/website/news/news/articles/index'
          },
          {
            title: '意见反馈',
            route: ''
          },
          {
            title: '联系我们',
            route: ''
          }
        ]
      }
    ]
  } */
]
