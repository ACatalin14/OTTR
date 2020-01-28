import Vue from 'vue';
import Vuetify from 'vuetify/lib';

const MY_ICONS = {
    home: 'mdi-home'
};

const opts = {
    icons: {
        iconfont: 'mdi',     // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' ; mdi = Material Design Icons,
        values: MY_ICONS
    },
    theme: {
        themes: {
            light: {
                primary: '#1515CA',
                secondary: '#FFF',  //F9FAFB
                accent: '#0E0E81',
                error: '#DC0028',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
                anchor: '#0000db'
            }
        }
    }
};

Vue.use(Vuetify);

export default new Vuetify(opts);
