import axios from 'axios';
import CONSTANTS from "../constants";

export default {

    async getTravelClassByCode(travelClassCode) {
        return axios
            .get(CONSTANTS.SERVER_URL + '/travel-class/code/' + travelClassCode)
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