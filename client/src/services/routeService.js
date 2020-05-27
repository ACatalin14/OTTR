import axios from 'axios';
import CONSTANTS from "../constants";

const dateFormat = require('dateformat');

export default {
    async index() {
        return axios
            .get(CONSTANTS.SERVER_URL + '/route/')
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    async getByName(name) {
        return axios
            .get(CONSTANTS.SERVER_URL + '/route/name/' + name)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    async create(entity) {
        return axios
            .post(CONSTANTS.SERVER_URL + '/route/', entity)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    async update(entity) {
        return axios
            .put(CONSTANTS.SERVER_URL + '/route/' + entity._id, entity)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    async delete(entityId) {
        return axios
            .delete(CONSTANTS.SERVER_URL + '/route/' + entityId)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    attachFrontendFields2MongoFormat(route) {

        let activeDays = '';
        const dateFormat = require('dateformat');
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const routeStations = route.routeStations;
        const depTime = new Date(route.departureTime);
        const arrTime = new Date(route.arrivalTime);
        const n = routeStations.length - 1;

        route.activeWeekDays.sort((a, b) => a - b);

        // If Sunday (0) is an active day, then push it to the end od the array
        if (route.activeWeekDays[0] === 0) {
            route.activeWeekDays.splice(0, 1);
            route.activeWeekDays.push(0);
        }

        route.activeWeekDays.forEach( dayNumber => {
            activeDays += daysOfWeek[dayNumber] + ' ';
        });
        activeDays = activeDays.slice(0, -1);

        route.frontend = {
            name: routeStations[0].station.code + '(' + dateFormat(depTime, 'HH:MM') + ')-' +
                routeStations[n].station.code + '(' + dateFormat(arrTime, 'HH:MM') + ')',
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

    // name: GL(09:00)-BUCN(14:04)    ===>  UTC name: GL(07:00)-BUCN(12:04)
    getUTCRouteName(name) {
        let utcName = '';

        const nameTokens = name.split(/[()-]/);
        const sourceCode = nameTokens[0];
        const departureTime = nameTokens[1];
        const destinationCode = nameTokens[3];
        const arrivalTime = nameTokens[4];
        utcName += sourceCode + '(';

        let depDate = new Date(2000, 0, 1);
        let hours = departureTime.substr(0, 2);
        let minutes = departureTime.substr(3, 2);
        depDate.setHours(parseInt(hours), parseInt(minutes));
        utcName += dateFormat(depDate, 'UTC:HH:MM');
        utcName += ')-' + destinationCode + '(';

        let arrDate = new Date(2000, 0, 1);
        hours = arrivalTime.substr(0, 2);
        minutes = arrivalTime.substr(3, 2);
        arrDate.setHours(parseInt(hours), parseInt(minutes));
        utcName += dateFormat(arrDate, 'UTC:HH:MM') + ')';

        return utcName;
    },

    throwServerError(err) {
        if (err.response) {
            throw err;
        }

        err.response = {data: {err: {message: CONSTANTS.ERRORS.UNREACHABLE_SERVER}}};
        throw err;
    }
}