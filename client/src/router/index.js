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
import CarLayoutsForm from "../views/CarLayoutsForm";
import RoutesForm from "../views/RoutesForm";
import TheRides from "../views/TheRides";
import RideSearchPage from "../views/RideSearchResultsPage";
import RideBookingPage from "../views/RideBookingPage";

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
        path: '/railway-management/routes/create',
        name: 'routesCreate',
        component: RoutesForm,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY
        }
    },
    {
        path: '/railway-management/routes/:routeName',
        name: 'routesEdit',
        component: RoutesForm,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY
        }
    },
    {
        path: '/railway-management/routes/:routeName/rides',
        name: 'rides',
        component: TheRides,
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
        name: 'carLayoutsForm',
        component: CarLayoutsForm,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY
        }
    },
    {
        path: '/railway-management/car-layouts/edit/:carLayoutName',
        name: 'carLayoutsEdit',
        component: CarLayoutsForm,
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
        // path example: /ride-search/from=BR&to=BUCN&date=2020-04-29&via=BZ&class=II
        path: '/ride-search/:filters',
        name: 'rideSearchResults',
        component: RideSearchPage,
    },
    {
        // path example: /book-ride/from=BR&to=BUCN&date=2020-04-29&via=BZ&class=II&departureTime=03:15&arrivalTime=09:45
        path: '/book-ride/:details',
        name: 'rideBooking',
        component: RideBookingPage,
        meta: {
            requiredAuthGroup: CONSTANTS.USER_GROUPS.AUTHENTICATED
        }
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

    // if accessing login/register page while logged in, redirect to My Account
    if (Store.getters.isLoggedIn && ['login', 'register'].includes(to.matched[0].name)) {
        next({ path: '/my-account' });
        return;
    }

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
