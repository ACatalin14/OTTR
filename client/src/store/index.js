import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

import AuthService from '../services/authService';

const getDefaultState = () => {
    return {
        token: '',
        user: {}
    };
};

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,   // TODO: set to FALSE when deploying for production
    plugins: [createPersistedState()],
    state: getDefaultState(),
    getters: {
        isLoggedIn: state => state.token,
        getUser: state => state.user
    },
    mutations: {
        setToken: (state, token) => { state.token = token },
        setUser: (state, user) => { state.user = user },
        reset: state => Object.assign(state, getDefaultState())
    },
    actions: {
        login: ({ commit, dispatch }, { token, user }) => {
            commit('setToken', token);
            commit('setUser', user);

            // set auth header
            Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        },
        logout: ({ commit }) => { commit('reset', '') }
    },
    modules: {
    }
})
