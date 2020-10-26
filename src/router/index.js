
import Vue from 'vue'
import VueRouter from 'vue-router'
import { stringifyQuery, parseQuery } from "../utils/query";//刷新参数丢失，去掉了，npm也删除了
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        meta: {
            noLogin: true,
        },
        component: Login
    },
    {
        path: '/CheckList',
        name: 'CheckList',
        meta: {
            index: 1,
            keepAlive: true,
            isBack : false,
        },
        component: () => import('../views/Evaluation/CheckList.vue')
    },
    {
        path: '/AddUser',
        name: 'AddUser',
        meta: {
            index: 1,
        },
        component: () => import('../views/Evaluation/AddUser.vue')
    },
    {
        path: '/UserList',
        name: 'UserList',
        meta: {
            index: 1,
        },
        component: () => import('../views/Evaluation/UserList.vue')
    },
    {
        path: '/Online',
        name: 'Online',
        meta: {
            index: 1,
        },
        component: () => import('../views/Evaluation/Online.vue')
    },
    {
        path: '/SubPaper',
        name: 'SubPaper',
        meta: {
            index: 0,
        },
        component: () => import('../views/Evaluation/SubPaper.vue')
    },
    {
        path: '/CheckQuestions',
        name: 'CheckQuestions',
        meta: {
            index: 1,
        },
        component: () => import('../views/Evaluation/CheckQuestions.vue')
    },
    {
        path: '/CheckReport',
        name: 'CheckReport',
        meta: {
            index: 1,
        },
        component: () => import('../views/Evaluation/CheckReport.vue')
    },
    {
        path: '/TaskList',
        name: 'TaskList',
        meta: {
            index: 2,
            keepAlive: true,
            isBack : false,
        },
        component: () => import('../views/Task/TaskList.vue')
    },
    {
        path: '/TaskReport',
        name: 'TaskReport',
        meta: {
            index: 2,
        },
        component: () => import('../views/Task/TaskReport.vue')
    },
    {
        path: '/Questions',
        name: 'Questions',
        meta: {
            index: 2,
        },
        component: () => import('../views/Task/Questions.vue')
    },
    {
        path: '/GradeReport',
        name: 'GradeReport',
        meta: {
            index: 2,
        },
        component: () => import('../views/Task/GradeReport.vue')
    },
    {
        path: '/Center',
        name: 'Center',
        meta: {
            index: 2,
        },
        component: () => import('../views/Task/Center.vue')
    },
    {
        path: '/Record',
        name: 'Record',
        meta: {
            index: 3,
            keepAlive: true,
            isBack : false,
        },
        component: () => import('../views/Task/Record.vue')
    },
]


const scrollBehavior = (to, from, savedPosition) => {

    return { x: 0, y: 0 }

}


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior,
    stringifyQuery: stringifyQuery,
    parseQuery: parseQuery,
    routes,
    scrollBehavior (to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash
            }
        }
    }
})


router.beforeEach(async (to, from, next) => {

    let token = localStorage.getItem('token')

    if(!token && !to.meta.noLogin)
        
        next('/')

    else

        next()

})


export default router
