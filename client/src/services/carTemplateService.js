import CrudService from './crudService';

const StationsService = CrudService.getCrudServiceForResource('station');
const TravelClassesService = CrudService.getCrudServiceForResource('travel-class');

export default {
    carTemplates: [],

    init(carTemplates = []) {
        this.carTemplates = [...carTemplates];

        for (let carTemplate of this.carTemplates) {

            carTemplate.mongoId = carTemplate._id;
            carTemplate._id = carTemplate.orderNo;
        }
    },

    index() {
        return this.carTemplates;
    },

    show(entityId) {
        return this.carTemplates.find(item => item._id === entityId);
    },

    async create(entityToCreate) {

        let entity = JSON.parse(JSON.stringify(entityToCreate));

        entity.orderNo = this.carTemplates.length + 1;
        entity._id = entity.orderNo;

        await this.sanitizeCarLayoutTravelClassStationsFields(entity);

        this.carTemplates.push(entity);
        this.carTemplates.sort((a, b) => a.orderNo - b.orderNo);
    },

    async update(entityToUpdate) {

        let entity = JSON.parse(JSON.stringify(entityToUpdate));

        await this.sanitizeCarLayoutTravelClassStationsFields(entity);

        const index = this.carTemplates.findIndex(carTemplate => carTemplate.orderNo === entity.orderNo );
        this.carTemplates[index] = entity;
    },

    delete(entityId) {
        const index = this.carTemplates.findIndex(item => item._id === entityId);

        if (index > -1) {

            this.carTemplates.splice(index, 1);

            for (let i = index; i < this.carTemplates.length; i++) {
                this.carTemplates[i].orderNo--;
                this.carTemplates[i]._id--;
            }
        }
    },

    moveUp(originalPosition) {

        const item = this.carTemplates[originalPosition];
        this.carTemplates.splice(originalPosition, 1);
        this.carTemplates.splice(originalPosition - 1, 0, item);

        this.carTemplates[originalPosition - 1].orderNo--;
        this.carTemplates[originalPosition - 1]._id--;
        this.carTemplates[originalPosition].orderNo++;
        this.carTemplates[originalPosition]._id++;

        return this.carTemplates;
    },

    moveDown(originalPosition) {

        const item = this.carTemplates[originalPosition];
        this.carTemplates.splice(originalPosition, 1);
        this.carTemplates.splice(originalPosition + 1, 0, item);

        this.carTemplates[originalPosition].orderNo--;
        this.carTemplates[originalPosition]._id--;
        this.carTemplates[originalPosition + 1].orderNo++;
        this.carTemplates[originalPosition + 1]._id++;

        return this.carTemplates;
    },

    async sanitizeCarLayoutTravelClassStationsFields(entity) {

        // const carLayouts = await CarLayoutsService.index();
        // entity.carLayout = carLayouts.find(carLayout => carLayout._id === entity.carLayout._id);

        const stations = await StationsService.index();
        entity.departureStation.station = stations.find(station => station._id === entity.departureStation.station._id);
        entity.arrivalStation.station = stations.find(station => station._id === entity.arrivalStation.station._id);

        const travelClasses = await TravelClassesService.index();
        entity.travelClass = travelClasses.find(travelClass => travelClass._id === entity.travelClass._id);
    }
}