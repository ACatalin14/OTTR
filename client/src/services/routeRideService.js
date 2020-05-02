import axios from 'axios';
import CONSTANTS from "../constants";
const dateFormat = require('dateformat');

export default {
    async getRidesForRoute(name) {
        return axios
            .get(CONSTANTS.SERVER_URL + '/route/name/' + name + '/rides')
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    async createRides(routeId, creationOptions) {
        return axios
            .post(CONSTANTS.SERVER_URL + '/route/' + routeId + '/rides', creationOptions)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    attachFrontendFields2MongoFormat(ride) {

        const last = ride.arrivalDates.length - 1;
        ride.depDateText = dateFormat(ride.departureDates[0], 'dd mmmm yyyy');
        ride.depTimeText = dateFormat(ride.departureDates[0], 'HH:MM');
        ride.arrDateText = dateFormat(ride.arrivalDates[last], 'dd mmmm yyyy');
        ride.arrTimeText = dateFormat(ride.arrivalDates[last], 'HH:MM');
        ride.carsCount = ride.cars.length;

        return ride;
    },

    delete(routeName, rideId) {
        return axios
            .delete(CONSTANTS.SERVER_URL + '/route/name/' + routeName + '/ride/' + rideId)
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