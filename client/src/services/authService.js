import axios from 'axios';

const url = 'http://localhost:3000/api';

export default {
    login(credentials) {
        return axios
            .post(url + '/user/login', credentials)
            .then(response => response.data);
    },
    register(credentials) {
        return axios
            .post(url + '/user/register', credentials)
            .then(response => response.data);
    },
    getUserDetails() {
        return axios
            .get(url + '/user/my-account')
            .then(response => response.data);
    }
};