import Layout from '@/page/index/'
export default [{
    path: '/wel',
    component: Layout,
    redirect: '/wel/index',
    children: [{
        path: 'index',
        name: '首页',
        component: () =>
            import ( /* webpackChunkName: "views" */ '@/page/wel')
    }]
},
{
    path: '/findAssets',
    name: '发现资产页',
    component: () =>
        import ( /* webpackChunkName: "page" */ '@/views/linkPages/findAssets'),
    meta: {
        isTab: false,
        isAuth: false
    }
},
{
    path: '/assets/assetsManagement',
    component: Layout,
    redirect: '/assets/assetsManagement/index',
    children: [{
        path: 'index',
        name: '资产管理',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/assets/assetsManagement'),
    }]
}, 
{
    path: '/assets/businessScenarioManagement',
    component: Layout,
    redirect: '/assets/businessScenarioManagement/index',
    children: [{
        path: 'index',
        name: '业务活动管理',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/assets/businessScenarioManagement'),
    }]
},
{
    path: '/assetsCharts/assetbusin',
    component: Layout,
    redirect: '/assetsCharts/assetbusin/index',
    children: [{
        path: 'index',
        name: '数据处理活动流图',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/assetsCharts/assetbusin'),
    }]
},
{
    path: '/assetsCharts/earth',
    component: Layout,
    redirect: '/assetsCharts/earth/index',
    children: [{
        path: 'index',
        name: '数据主体映射图',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/assetsCharts/earth'),
    }]
},
 {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [{
        path: 'index',
        name: '个人信息',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/admin/user/info'),
    }]
}]
