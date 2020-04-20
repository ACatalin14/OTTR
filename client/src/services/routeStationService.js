const dateFormat = require('dateformat');
import CrudService from './crudService';

const StationsService = CrudService.getCrudServiceForResource('station');

export default {
    routeStations: [],
    
    init(stations = []) {
        this.routeStations = [...stations];

        for (let station of this.routeStations) {

            station.isSource = false;
            station.isDestination = false;
            station.mongoId = station._id;
            station._id = station.orderNo;

            if ( new Date(station.departureTime).getTime() === 0) {
                // destination station
                station.isSource = false;
                station.isDestination = true;
                station.arrivalTimeText = dateFormat(station.arrivalTime, 'HH:MM');
                station.departureTimeText = 'N/A';
                station.haltText = 'N/A';
                station.stationTypeRadio = 'destination';
                station.arrivalDay = 1 + Math.floor(
                    (new Date(station.arrivalTime) - new Date(2000, 0, 1)) / (1000 * 3600 * 24)
                );
                station.departureDay = 1;

            } else if ( new Date(station.arrivalTime).getTime() === 0) {
                // source station
                station.isSource = true;
                station.isDestination = false;
                station.arrivalTimeText = 'N/A';
                station.departureTimeText = dateFormat(station.departureTime, 'HH:MM');
                station.haltText = 'N/A';
                station.stationTypeRadio = 'source';
                station.arrivalDay = 1;
                station.departureDay = 1 + Math.floor(
                    (new Date(station.departureTime) - new Date(2000, 0, 1)) / (1000 * 3600 * 24)
                );

            } else {
                // internal station
                station.isSource = false;
                station.isDestination = false;
                station.arrivalTimeText = dateFormat(station.arrivalTime, 'HH:MM');
                station.departureTimeText = dateFormat(station.departureTime, 'HH:MM');

                const hours = Number.parseInt(station.halt / 1000 / 60 / 60);
                const minutes = Number.parseInt(station.halt / 1000 / 60);
                const seconds = Number.parseInt(station.halt / 1000);

                // station.haltText = (hours < 10 ? '0' : '') + hours.toString() + ':' +
                //     (minutes % 60 < 10 ? '0' : '') + (minutes % 60).toString() + ':' +
                //     (seconds % 60 < 10 ? '0' : '') + (seconds % 60).toString();

                station.haltText = (hours < 10 ? '0' : '') + hours.toString() + ':' +
                    (minutes % 60 < 10 ? '0' : '') + (minutes % 60).toString();

                station.stationTypeRadio = 'internal';
                station.arrivalDay = 1 + Math.floor(
                    (new Date(station.arrivalTime) - new Date(2000, 0, 1)) / (1000 * 3600 * 24)
                );
                station.departureDay = 1 + Math.floor(
                    (new Date(station.departureTime) - new Date(2000, 0, 1)) / (1000 * 3600 * 24)
                );
            }
        }
    },

    index() {
        return this.routeStations;
    },

    show(entityId) {
        return this.routeStations.find(item => item._id === entityId);
    },

    async create(entityToCreate) {

        let entity = JSON.parse(JSON.stringify(entityToCreate));

        entity.orderNo = this.routeStations.length + 1;
        entity._id = entity.orderNo;

        this.setStationTimestampsBasedOnTimeTexts(entity);

        const stations = await StationsService.index();
        const station = stations.find( station => station._id === entity.station._id );
        entity.station.name = station.name;

        this.routeStations.push(entity);
        this.routeStations.sort((a, b) => a.orderNo - b.orderNo);
    },

    async update(entityToUpdate) {

        let entity = JSON.parse(JSON.stringify(entityToUpdate));

        this.setStationTimestampsBasedOnTimeTexts(entity);

        const stations = await StationsService.index();
        const station = stations.find( station => station._id === entity.station._id );
        entity.station.name = station.name;

        const index = this.routeStations.findIndex( routeStation => routeStation.orderNo === entity.orderNo );

        this.routeStations[index] = entity;
    },

    delete(entityId) {
        const index = this.routeStations.findIndex(item => item._id === entityId);

        if (index > -1) {

            this.routeStations.splice(index, 1);

            for (let i = index; i < this.routeStations.length; i++) {
                this.routeStations[i].orderNo--;
                this.routeStations[i]._id--;
            }
        }
    },

    moveUp(originalPosition) {

        const item = this.routeStations[originalPosition];
        this.routeStations.splice(originalPosition, 1);
        this.routeStations.splice(originalPosition - 1, 0, item);

        this.routeStations[originalPosition - 1].orderNo--;
        this.routeStations[originalPosition - 1]._id--;
        this.routeStations[originalPosition].orderNo++;
        this.routeStations[originalPosition]._id++;

        return this.routeStations;
    },

    moveDown(originalPosition) {

        const item = this.routeStations[originalPosition];
        this.routeStations.splice(originalPosition, 1);
        this.routeStations.splice(originalPosition + 1, 0, item);

        this.routeStations[originalPosition].orderNo--;
        this.routeStations[originalPosition]._id--;
        this.routeStations[originalPosition + 1].orderNo++;
        this.routeStations[originalPosition + 1]._id++;

        return this.routeStations;
    },

    setStationTimestampsBasedOnTimeTexts(entity) {

        if (entity.isSource) {

            entity.arrivalTime = new Date(0);
            entity.departureTime = this.getStandardDateFromDayTime(entity.departureDay, entity.departureTimeText);
            entity.haltText = 'N/A';
            entity.arrivalTimeText = 'N/A';

        } else if (entity.isDestination) {

            entity.arrivalTime = this.getStandardDateFromDayTime(entity.arrivalDay, entity.arrivalTimeText);
            entity.departureTime = new Date(0);
            entity.haltText = 'N/A';
            entity.departureTimeText = 'N/A';
        } else {

            entity.arrivalTime = this.getStandardDateFromDayTime(entity.arrivalDay, entity.arrivalTimeText);
            entity.departureTime = this.getStandardDateFromDayTime(entity.departureDay, entity.departureTimeText);

            entity.halt = entity.departureTime - entity.arrivalTime;
            const hours = Math.floor(entity.halt / (1000 * 3600));
            const minutes = Math.floor(entity.halt / (1000 * 60));

            entity.haltText = (hours < 10 ? '0' : '') + hours.toString() + ':' +
                (minutes % 60 < 10 ? '0' : '') + (minutes % 60).toString();
        }
    },

    getStandardDateFromDayTime(day, timeText) {

        let stdDate = new Date(2000, 0, 1);

        stdDate.setHours(
            parseInt(timeText.substr(0, 2))
        );
        stdDate.setMinutes(
            parseInt(timeText.substr(3, 2))
        );
        stdDate.setDate(day);

        return stdDate;
    }
}