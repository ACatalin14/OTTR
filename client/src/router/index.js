import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/Login";
import Register from "../views/Register";
import PageNotFound from "../views/PageNotFound";
import MyAccount from "../views/MyAccount";
import TheDashboard from "../views/TheDashboard";
import TheCopyright from "../views/TheCopyright";
import TheRoutes from "../views/TheRoutes";
import TheMiscellaneous from "../views/TheMiscellaneous";

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/my-account',
        name: 'my-account',
        component: MyAccount
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: TheDashboard
    },
    {
        path: '/railway-management/routes',
        name: 'routes',
        component: TheRoutes
    },
    {
        path: '/railway-management/miscellaneous',
        name: 'miscellaneous',
        component: TheMiscellaneous
    },
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/copyrights',
        name: 'copyrights',
        component: TheCopyright,
    },
    {
        path: '*',
        name: 'pageNotFound',
        component: PageNotFound
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
