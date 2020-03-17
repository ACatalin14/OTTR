import axios from 'axios';
import CONSTANTS from "../constants";

export default {
    getByName(name) {
        return axios
            .get(CONSTANTS.SERVER_URL + '/car-layout/name/' + name)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    throwServerError(err) {
        if (err.response) {
            throw err;
        }

        err.response = {data: {err: {message: CONSTANTS.ERRORS.UNREACHABLE_SERVER}}};
        throw err;
    }
}