import axios from 'axios';
import CONSTANTS from "../constants";

export default {
    index() {
        return axios
            .get(CONSTANTS.SERVER_URL + '/station/')
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    show(stationId) {
        return axios
            .get(CONSTANTS.SERVER_URL + '/station/' + stationId)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    create(station) {
        return axios
            .post(CONSTANTS.SERVER_URL + '/station/', station)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    update(station) {
        return axios
            .put(CONSTANTS.SERVER_URL + '/station/' + station._id, station)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    delete(stationId) {
        return axios
            .delete(CONSTANTS.SERVER_URL + '/station/' + stationId)
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