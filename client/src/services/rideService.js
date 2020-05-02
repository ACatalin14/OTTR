import axios from 'axios';
import CONSTANTS from "../constants";

export default {
    async getFilteredRides(filters) {
        let url = CONSTANTS.SERVER_URL + '/ride/source/' + filters.sourceId + '/destination/' + filters.destinationId +
            '/date/' + filters.date;
        url += filters.viaStationId ? '/via/' + filters.viaStationId : '';
        url += filters.travelClassId ? '/travelClass/' + filters.travelClassId : '';

        return axios
            .get(url)
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