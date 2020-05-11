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

    async getRideByDetails(details) {
        let url = CONSTANTS.SERVER_URL + '/ride/source/' + details.sourceId + '/destination/' + details.destinationId +
            '/date/' + details.date + '/departureTime/' + details.departureTime + '/arrivalTime/' + details.arrivalTime;

        return axios
            .get(url)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    getCarsContainingSourceDestination(ride, departureStationId, destinationStationId) {

        const requestedDepRouteStation = ride.routeStations.find( routeStation => {
            return routeStation.station._id === departureStationId;
        });

        const requestedArrRouteStation = ride.routeStations.find( routeStation => {
            return routeStation.station._id === destinationStationId;
        });

        return ride.cars.filter( car => {

            const depCarStationOrnerNo = car.departureStation.orderNo;
            const arrCarStationOrnerNo = car.arrivalStation.orderNo;

            return depCarStationOrnerNo <= requestedDepRouteStation.orderNo
                && requestedDepRouteStation.orderNo < arrCarStationOrnerNo
                && depCarStationOrnerNo < requestedArrRouteStation.orderNo
                && requestedArrRouteStation.orderNo <= arrCarStationOrnerNo;
        });
    },

    throwServerError(err) {
        if (err.response) {
            throw err;
        }

        err.response = {data: {err: {message: CONSTANTS.ERRORS.UNREACHABLE_SERVER}}};
        throw err;
    }
}