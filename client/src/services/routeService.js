import axios from 'axios';
import CONSTANTS from "../constants";

export default {
    index() {
        return axios
            .get(CONSTANTS.SERVER_URL + '/route/')
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    attachFrontendFields2MongoFormat(route) {

        let activeDays = '';
        const dateFormat = require('dateformat');
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const routeStations = route.routeStations;
        const depTime = new Date(route.departureTime);
        const arrTime = new Date(route.arrivalTime);
        const n = routeStations.length - 1;

        route.activeWeekDays.sort((a, b) => a - b);

        route.activeWeekDays.forEach( dayNumber => {
            activeDays += daysOfWeek[dayNumber - 1] + ' ';
        });
        activeDays = activeDays.slice(0, -1);

        route.frontend = {
            name: routeStations[0].station.name + ' (' + dateFormat(depTime, 'HH:MM') + ') - ' +
                routeStations[n].station.name + ' (' + dateFormat(arrTime, 'HH:MM') + ')',
            depStation: routeStations[0].station.name,
            arrStation: routeStations[n].station.name,
            depTime: dateFormat(depTime, 'HH:MM'),
            arrTime: dateFormat(arrTime, 'HH:MM'),
            train: route.train.trainCategory.code + ' ' + route.train.number,
            activeDays: activeDays,
            halts: routeStations.length - 2
        };

        return route;
    },

    throwServerError(err) {
        if (err.response) {
            throw err;
        }

        err.response = {data: {err: {message: CONSTANTS.ERRORS.UNREACHABLE_SERVER}}};
        throw err;
    }
}