<template>
    <v-card flat>
        <v-card-text class="pl-7">
            <CarLayoutDialog
                :state="printedCarLayoutDialog"
                :car-layout="printedCarLayout"
                @changeDialogState="onChangeCarLayoutDialogState"
            >
            </CarLayoutDialog>
            <v-card class="mb-5">
                <v-card-title>
                    Train Details
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="6" md="3">
                            <v-select
                                v-model="currentTrain.trainCategory"
                                :items="trainCategoriesSelectItems"
                                menu-props="auto"
                                label="Train Category"
                                prepend-icon="mdi-train-variant"
                                :rules="validationRules.trainCategory"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field
                                v-model="currentTrain.number"
                                label="Train Number"
                                prepend-icon="mdi-counter"
                                type="number"
                                :rules="validationRules.trainNumber"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <CrudTable
                entity="car template"
                entity-name-plural="car templates"
                with-change-order
                with-show-item
                :headers="headers"
                :service="carTemplatesService"
                :default-item="defaultCarTemplate"
                change-order-color="primary"
                sort-default-by="orderNo"
                @serverError="onServerError"
                @movedUpItem="notifyChangedCarTemplates"
                @movedDownItem="notifyChangedCarTemplates"
                @createdItem="notifyChangedCarTemplates"
                @updatedItem="notifyChangedCarTemplates"
                @deletedItem="notifyChangedCarTemplates"
                @showItem="showSelectedCarLayout"
            >
                <template #form="{ editedItem }">
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field
                                    v-model="editedItem.number"
                                    label="Car Number"
                                    prepend-icon="mdi-numeric"
                                    :rules="validationRules.number"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select
                                    v-model="editedItem.travelClass._id"
                                    :items="travelClassesSelectItems"
                                    menu-props="auto"
                                    label="Travel Class"
                                    prepend-icon="mdi-seat-passenger"
                                    :rules="validationRules['travelClass._id']"
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-select
                                    v-model="editedItem.departureStation.station._id"
                                    :items="stationsSelectItems"
                                    menu-props="auto"
                                    label="Departure Station"
                                    prepend-icon="mdi-city"
                                    :rules="validationRules['departureStation.station._id']"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select
                                    v-model="editedItem.arrivalStation.station._id"
                                    :items="stationsSelectItems"
                                    menu-props="auto"
                                    label="Arrival Station"
                                    prepend-icon="mdi-city"
                                    :rules="validationRules['arrivalStation.station._id']"
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-select
                                    v-model="editedItem.carLayout"
                                    :items="carLayoutsSelectItems"
                                    menu-props="auto"
                                    label="Car Layout"
                                    append-outer-icon="mdi-eye"
                                    :rules="validationRules['carLayout']"
                                    @click:append-outer="showSelectedCarLayout(editedItem)"
                                ></v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                </template>
            </CrudTable>
        </v-card-text>
    </v-card>
</template>

<script>
    import CarTemplatesService from '../services/carTemplateService'
    import CrudTable from "./CrudTable";
    import CrudService from "../services/crudService";
    import CarLayoutService from '../services/carLayoutService';
    import CarLayoutDialog from "./CarLayoutDialog";

    export default {
        name: "TrainCarsPanel",
        components: {CarLayoutDialog, CrudTable},
        props: {
            carTemplates: Array,
            train: Object,
            routeStations: Array
        },

        data() {
            return {
                carTemplatesService: CarTemplatesService,
                stationsService: CrudService.getCrudServiceForResource('station'),
                carLayoutsCrudService: CrudService.getCrudServiceForResource('car-layout'),
                travelClassesService: CrudService.getCrudServiceForResource('travel-class'),
                trainCategoriesService: CrudService.getCrudServiceForResource('train-category'),
                headers: [
                    { text: 'No.', value: 'orderNo', align: 'center' },
                    { text: 'Number', value: 'number', align: 'center' },
                    { text: 'Travel Class', value: 'travelClass.code', align: 'center' },
                    { text: 'Departure Station', value: 'departureStation.station.name', align: 'center' },
                    { text: 'Arrival Station', value: 'arrivalStation.station.name', align: 'center' },
                    { text: 'Car Layout', value: 'carLayout.name', align: 'center' }
                ],
                currentTrain: {
                    number: '',
                    trainCategory: {}
                },
                defaultCarTemplate: {
                    _id: '',
                    mongoId: '',
                    orderNo: '',
                    number: '',
                    departureStation: {
                        station: {
                            _id: '',
                            name: ''
                        }
                    },
                    arrivalStation: {
                        station: {
                            _id: '',
                            name: ''
                        }
                    },
                    travelClass: {
                        _id: '',
                        code: ''
                    },
                    carLayout: { }
                },
                stationsSelectItems: [],
                travelClassesSelectItems: [],
                carLayoutsSelectItems: [],
                trainCategoriesSelectItems: [],
                printedCarLayout: { },
                printedCarLayoutDialog: false,
                validationRules: {
                    'departureStation.station._id': [
                        id => !!id || 'Departure station is required'
                    ],
                    'arrivalStation.station._id': [
                        id => !!id || 'Arrival station is required'
                    ],
                    'travelClass._id': [
                        id => !!id || 'Travel class is required'
                    ],
                    'carLayout': [
                        carLayout => Object.keys(carLayout).length > 0 || 'Car layout is required'
                    ],
                    'number': [
                        no => !!no || 'Car number is required',
                    ],
                    'trainNumber': [
                        no => !!no || 'Train number is required',
                        no => no > 0 || 'Train number must be greater than 0'
                    ],
                    'trainCategory': [
                        trainCategory => Object.keys(trainCategory).length > 0 || 'Train category is required'
                    ]
                }
            }
        },

        async created() {
            this.carTemplatesService.init(this.carTemplates);

            if (this.train) {
                this.currentTrain = JSON.parse(JSON.stringify(this.train));
            }

            const stations = JSON.parse(JSON.stringify(this.routeStations));

            stations.sort((a, b) => {
                const A = a.station.name.toUpperCase(), B = b.station.name.toUpperCase();
                return A < B ? -1 : (A > B ? 1 : 0);
            });

            stations.forEach( (station) => {
                this.stationsSelectItems.push({
                    value: station.station._id,
                    text: station.station.name
                });
            });

            const carLayouts = await this.carLayoutsCrudService.index();

            carLayouts.sort((a, b) => {
                const A = a.name.toUpperCase(), B = b.name.toUpperCase();
                return A < B ? -1 : (A > B ? 1 : 0);
            });

            carLayouts.forEach( (carLayout) => {
                this.carLayoutsSelectItems.push({
                    value: carLayout,
                    text: carLayout.name
                });
            });

            const travelClasses = await this.travelClassesService.index();

            travelClasses.forEach( (travelClass) => {
                this.travelClassesSelectItems.push({
                    value: travelClass._id,
                    text: travelClass.code
                });
            });

            const trainCategories = await this.trainCategoriesService.index();

            trainCategories.forEach( (trainCategory) => {
                this.trainCategoriesSelectItems.push({
                    value: trainCategory,
                    text: trainCategory.code
                });
            });
        },

        watch: {
            currentTrain: {
                deep: true,
                handler() {
                    this.$emit('changedTrain', this.currentTrain);
                }
            },

            routeStations: {
                deep: true,
                handler() {
                    const stations = JSON.parse(JSON.stringify(this.routeStations));
                    this.stationsSelectItems = [];

                    stations.sort((a, b) => {
                        const A = a.station.name.toUpperCase(), B = b.station.name.toUpperCase();
                        return A < B ? -1 : (A > B ? 1 : 0);
                    });

                    stations.forEach( (station) => {
                        this.stationsSelectItems.push({
                            value: station.station._id,
                            text: station.station.name
                        });
                    });
                }
            }
        },

        methods: {

            onServerError(errorMessage) {
                this.$emit('serverError', errorMessage);
            },

            notifyChangedCarTemplates() {
                const newCarTemplates = this.carTemplatesService.index();
                this.$emit('changedCarTemplates', newCarTemplates);
            },

            showSelectedCarLayout(carTemplate) {
                if (!carTemplate.carLayout ||
                    !Object.keys(carTemplate.carLayout).length ||
                    !carTemplate.carLayout.name
                ) {
                    return;
                }

                this.printedCarLayout = CarLayoutService.transformFromMongo2FrontendModel(carTemplate.carLayout);
                this.printedCarLayoutDialog = true;
            },

            onChangeCarLayoutDialogState(newState) {
                this.printedCarLayoutDialog = newState;
            }
        }
    }
</script>

<style scoped>

</style>