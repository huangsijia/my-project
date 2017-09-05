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
      path: '/home/login',
      component: (resolve) => {
        require(['./components/home/login.vue'], resolve)
      }
    }
  ]
}

export default routerOption;