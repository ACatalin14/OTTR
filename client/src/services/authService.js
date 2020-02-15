import axios from 'axios';
import CONSTANTS from "../constants";

const url = 'http://localhost:3000/api';

export default {
    login(credentials) {
        return axios
            .post(url + '/user/login', credentials)
            .then(response => response.data)
            .catch(err => {
                if (err.response) {
                    throw err;
                }

                err.response = {data: {err: {message: CONSTANTS.ERRORS.UNREACHABLE_SERVER}}};
                throw err;
            });
    },
    register(credentials) {
        return axios
            .post(url + '/user/register', credentials)
            .then(response => response.data)
            .catch(err => {
                if (err.response) {
                    throw err;
                }

                err.response = {data: {err: {message: CONSTANTS.ERRORS.UNREACHABLE_SERVER}}};
                throw err;
            });
    },
    getUserDetails() {
        return axios
            .get(url + '/user/my-account')
            .then(response => response.data);
    }
};