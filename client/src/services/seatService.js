import axios from 'axios';
import CONSTANTS from "../constants";

export default {
    selectSeat(seatId) {

        return axios
            .patch(CONSTANTS.SERVER_URL + '/seat/' + seatId + '/selected/true')
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    deselectSeat(seatId) {

        return axios
            .patch(CONSTANTS.SERVER_URL + '/seat/' + seatId + '/selected/false')
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    preserveSeat(seatId) {

        return axios
            .patch(CONSTANTS.SERVER_URL + '/seat/' + seatId + '/preserve')
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