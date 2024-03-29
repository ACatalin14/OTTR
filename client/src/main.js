import Vue from 'vue';
import Axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import VueTelInputVuetify from 'vue-tel-input-vuetify';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

// set auth header
Axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;

Vue.use(VueTelInputVuetify, {
  vuetify,
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
