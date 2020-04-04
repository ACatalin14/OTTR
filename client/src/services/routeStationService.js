const dateFormat = require('dateformat');
import CrudService from './crudService';

// let this.routeStations = [];
const StationsService = CrudService.getCrudServiceForResource('station');

export default {
    routeStations: [],
    
    init(stations = []) {
        this.routeStations = [...stations];

        for (let station of this.routeStations) {
            station.departureTimeText = dateFormat(station.departureTime, 'HH:MM');
            station.arrivalTimeText = dateFormat(station.arrivalTime, 'HH:MM');

            if (station.halt !== 0) {

                const hours = Number.parseInt(station.halt / 1000 / 60 / 60);
                const minutes = Number.parseInt(station.halt / 1000 / 60);
                const seconds = Number.parseInt(station.halt / 1000);

                // station.haltText = (hours < 10 ? '0' : '') + hours.toString() + ':' +
                //     (minutes % 60 < 10 ? '0' : '') + (minutes % 60).toString() + ':' +
                //     (seconds % 60 < 10 ? '0' : '') + (seconds % 60).toString();

                station.haltText = (hours < 10 ? '0' : '') + hours.toString() + ':' +
                    (minutes % 60 < 10 ? '0' : '') + (minutes % 60).toString();

            } else {
                station.haltText = 'N/A';
            }

            station.isSource = false;
            station.isDestination = false;

            if ( new Date(station.departureTime).getTime() === 0) {
                station.isDestination = true;
                station.departureTimeText = 'N/A'
            }

            if ( new Date(station.arrivalTime).getTime() === 0) {
                station.isSource = true;
                station.arrivalTimeText = 'N/A'
            }

            station.stationTypeRadio = station.isSource ? 'source' :
                station.isDestination ? 'destination' :
                'internal';
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
        console.log(entity);

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
            }
        }
    },

    moveUp(originalPosition) {

        const item = this.routeStations[originalPosition];
        this.routeStations.splice(originalPosition, 1);
        this.routeStations.splice(originalPosition - 1, 0, item);

        this.routeStations[originalPosition - 1].orderNo--;
        this.routeStations[originalPosition].orderNo++;

        return this.routeStations;
    },

    moveDown(originalPosition) {

        const item = this.routeStations[originalPosition];
        this.routeStations.splice(originalPosition, 1);
        this.routeStations.splice(originalPosition + 1, 0, item);

        this.routeStations[originalPosition].orderNo--;
        this.routeStations[originalPosition + 1].orderNo++;

        return this.routeStations;
    },

    setStationTimestampsBasedOnTimeTexts(entity) {

        let depTimeArr = [], depTime = 0, arrTimeArr = [], arrTime = 0;

        entity.arrivalTimeText = entity.isSource ? 'N/A' : entity.arrivalTimeText;
        entity.departureTimeText = entity.isDestination ? 'N/A' : entity.departureTimeText;

        if (!entity.isSource) {
            arrTimeArr = entity.arrivalTimeText.split(':').map(str => parseInt(str));
            arrTime = new Date(2000, 1, 1, arrTimeArr[0], arrTimeArr[1]);
        }

        if (!entity.isDestination) {
            depTimeArr = entity.departureTimeText.split(':').map(str => parseInt(str));
            depTime = new Date(2000, 1, 1, depTimeArr[0], depTimeArr[1]);
        }

        if (entity.isSource || entity.isDestination) {
            entity.haltText = 'N/A';
        } else {
            // TODO: should keep track of different days (train goes from A at day 1 and arrives at B at day 3)
            if (depTime < arrTime) {
                depTime.setDate(depTime.getDate() + 1);
            }

            const halt = depTime - arrTime;
            const hours = Number.parseInt(halt / 1000 / 60 / 60);
            const minutes = Number.parseInt(halt / 1000 / 60);

            entity.haltText = (hours < 10 ? '0' : '') + hours.toString() + ':' +
                (minutes % 60 < 10 ? '0' : '') + (minutes % 60).toString();
        }

        entity.arrivalTime = arrTime === 0 ? 0 : arrTime.getTime();
        entity.departureTime = depTime === 0 ? 0 : depTime.getTime();
    }
}