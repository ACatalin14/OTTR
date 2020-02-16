import axios from 'axios';
import CONSTANTS from "../constants";

export default {
    edit(user) {
        return axios
            .put(CONSTANTS.SERVER_URL + '/user/' + user._id, user)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    delete(userId) {
        return axios
            .delete(CONSTANTS.SERVER_URL + '/user/' + userId)
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