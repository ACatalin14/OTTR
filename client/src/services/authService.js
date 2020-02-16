import axios from 'axios';
import CONSTANTS from "../constants";

export default {
    login(credentials) {
        return axios
            .post(CONSTANTS.SERVER_URL + '/user/login', credentials)
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
            .post(CONSTANTS.SERVER_URL + '/user/register', credentials)
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
            .get(CONSTANTS.SERVER_URL + '/user/my-account')
            .then(response => response.data);
    }
};