import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

const getDefaultState = () => {
    return {
        token: '',
        user: {},
        notification: {
            state: false,
            message: ''
        }
    };
};

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,   // TODO: set to FALSE when deploying for production
    plugins: [createPersistedState()],
    state: getDefaultState(),
    getters: {
        isLoggedIn: state => state.token,
        getUser: state => state.user,
        getNotification: state => state.notification
    },
    mutations: {
        setToken: (state, token) => { state.token = token },
        setUser: (state, user) => { state.user = user },
        setNotification: (state, notification) => { state.notification = notification },
        reset: state => Object.assign(state, getDefaultState())
    },
    actions: {
        login: ({ commit, dispatch }, { token, user }) => {
            commit('setToken', token);
            commit('setUser', user);

            // set auth header
            Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        },
        logout: ({ commit }) => { commit('reset', '') },
        showNotification: ({ commit }, { msg }) => {
            commit('setNotification', {
                state: true,
                message: msg
            });
        },
        hideNotification: ({ commit }) => {
            commit('setNotification', {
                state: false,
                message: ''
            });
        },
    },
    modules: {
    }
})
