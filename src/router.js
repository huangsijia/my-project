const routerOption = {
    base: __dirname,
    routes:[{
        path:'/',
        redirect:'/index/index'
    },
    {
      path: '/index/index',
      component: (resolve) => {
        require(['./components/index/index.vue'], resolve)
      }
    },
    {
      path: '/bill/index',
      component: (resolve) => {
        require(['./components/bill/index.vue'], resolve)
      }
    },
    {
      path: '/home/index',
      component: (resolve) => {
        require(['./components/home/index.vue'], resolve)
      }
    },
    {
      path: '/index/login',
      component: (resolve) => {
        require(['./components/index/login.vue'], resolve)
      }
    },
    {
      path: '/index/forget',
      component: (resolve) => {
        require(['./components/index/forget.vue'], resolve)
      }
    },
    {
      path: '/index/register',
      component: (resolve) => {
        require(['./components/index/register.vue'], resolve)
      }
    },
    {
      path: '/index/resetPwd',
      component: (resolve) => {
        require(['./components/index/resetPwd.vue'], resolve)
      }
    }
  ]
}

export default routerOption;