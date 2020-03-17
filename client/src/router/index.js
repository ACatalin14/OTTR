import CONSTANTS from "../constants";
import Vue from 'vue';
import VueRouter from 'vue-router';
import Store from '../store';
import Home from '../views/Home.vue'
import Login from "../views/Login";
import Register from "../views/Register";
import PageNotFound from "../views/PageNotFound";
import MyAccount from "../views/MyAccount";
import TheDashboard from "../views/TheDashboard";
import TheCopyright from "../views/TheCopyright";
import TheRoutes from "../views/TheRoutes";
import TheMiscellaneous from "../views/TheMiscellaneous";
import TheStudents from "../views/TheStudents";
import CarLayouts from "../views/CarLayouts";
import CarLayoutsCreate from "../views/CarLayoutsCreate";
import CarLayoutsShow from "../views/CarLayoutsShow";

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
        component: MyAccount,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.AUTHENTICATED
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: TheDashboard,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY
        }
    },
    {
        path: '/railway-management/routes',
        name: 'routes',
        component: TheRoutes,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY
        }
    },
    {
        path: '/railway-management/car-layouts',
        name: 'carLayouts',
        component: CarLayouts,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY
        }
    },
    {
        path: '/railway-management/car-layouts/create',
        name: 'carLayoutsCreate',
        component: CarLayoutsCreate,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY
        }
    },
    {
        path: '/railway-management/car-layouts/:carLayoutName',
        name: 'carLayoutsShow',
        component: CarLayoutsShow,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY
        }
    },
    {
        path: '/railway-management/car-layouts/edit/:carLayoutName',
        name: 'carLayoutsEdit',
        component: CarLayoutsCreate,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY
        }
    },
    {
        path: '/railway-management/miscellaneous',
        name: 'miscellaneous',
        component: TheMiscellaneous,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY
        }
    },
    {
        path: '/users-management/students',
        name: 'students',
        component: TheStudents,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY
        }
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

router.beforeEach((to, from, next) => {

    const userRole = Store.getters.getUser.role;

    // check if there aren't matched routes needing special user rights
    if (to.matched.every(record => !record.meta.requiredAuthGroup)) {
        next();
        return;
    }

    // if route is secured, check if user has rights to access it
    if (!Store.getters.isLoggedIn || !to.matched[0].meta.requiredAuthGroup.includes(userRole)) {
        next({ path: '/login' });
        return;
    }

    next();
});

export default router
