import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/Login";
import Register from "../views/Register";

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
    path: '/gallery',
    name: 'gallery',
    component: Register
  },
  {
    path: '/contact',
    name: 'contact',
    component: Register
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
