<template>
    <v-card flat>
        <v-card-text class="pl-7">
            <CrudTable
                entity="route station"
                entity-name-plural="route stations"
                with-change-order
                :headers="headers"
                :service="service"
                :default-item="defaultItem"
                sort-default-by="orderNo"
                @serverError="onServerError"
                @movedUpItem="notifyChangedRouteStations"
                @movedDownItem="notifyChangedRouteStations"
                @createdItem="notifyChangedRouteStations"
                @updatedItem="notifyChangedRouteStations"
                @deletedItem="notifyChangedRouteStations"
            >
                <template #form="{ editedItem }">
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="8">
                                <v-select
                                    v-model="editedItem.station._id"
                                    :items="stationsSelectItems"
                                    menu-props="auto"
                                    label="Station"
                                    prepend-icon="mdi-city"
                                    :rules="validationRules['station._id']"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field
                                    v-model="editedItem.distance"
                                    label="Distance"
                                    type="number"
                                    suffix="Km"
                                    :rules="validationRules.distance"
                                    :disabled="editedItem.isSource"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        <v-row>
                            <v-col>
                                <p class="title mb-n2"> Station Type </p>
                                <v-radio-group
                                    v-model="editedItem.stationTypeRadio"
                                    :mandatory="true"
                                    @change="onRadioChange(editedItem)"
                                >
                                    <v-radio
                                        label="The route's point of departure"
                                        value="source"
                                    ></v-radio>
                                    <v-radio
                                        label="An internal node of the route"
                                        value="internal"
                                    ></v-radio>
                                    <v-radio
                                        label="The route's point of arrival"
                                        value="destination"
                                    ></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        <v-row v-if="!editedItem.isSource">
                            <v-col cols="5" sm="4">
                                <v-text-field
                                    v-model.number="editedItem.arrivalDay"
                                    value="1"
                                    label="Arrival Day"
                                    type="number"
                                    prepend-icon="mdi-clock-end"
                                    :rules="validationRules.arrivalDay"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="7" sm="6">
                                <TimePicker
                                    name="arrTimeRouteStation"
                                    label="Arrival Time"
                                    requiredMessage="Arrival time is required"
                                    :initial-value="editedItem.arrivalTimeText"
                                    @timePickerChanged="onTimePickerChanged(editedItem, $event)"
                                >
                                </TimePicker>
                            </v-col>
                        </v-row>
                        <v-row v-if="!editedItem.isDestination">
                            <v-col cols="5" sm="4">
                                <v-text-field
                                    v-model.number="editedItem.departureDay"
                                    value="1"
                                    label="Departure Day"
                                    type="number"
                                    prepend-icon="mdi-clock-start"
                                    :rules="validationRules.departureDay"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="7" sm="6">
                                <TimePicker
                                    name="depTimeRouteStation"
                                    label="Departure Time"
                                    requiredMessage="Departure time is required"
                                    :initial-value="editedItem.departureTimeText"
                                    @timePickerChanged="onTimePickerChanged(editedItem, $event)"
                                >
                                </TimePicker>
                            </v-col>
                        </v-row>
                    </v-container>
                </template>
            </CrudTable>
        </v-card-text>
    </v-card>
</template>

<script>
    import CrudTable from "./CrudTable";
    import RouteStationService from '../services/routeStationService';
    import CrudService from '../services/crudService';
    import TimePicker from "./TimePicker";

    export default {
        name: "RouteStationsPanel",
        components: {TimePicker, CrudTable},
        props: {
            items: Array
        },
        data() {
            return {
                service: RouteStationService,
                stationService: CrudService.getCrudServiceForResource('station'),
                headers: [
                    { text: 'No.', value: 'orderNo', align: 'center' },
                    { text: 'Station', value: 'station.name', align: 'center' },
                    { text: 'Distance (Km)', value: 'distance', align: 'center' },
                    { text: 'Arrival', value: 'arrivalTimeText', align: 'center' },
                    { text: 'Departure', value: 'departureTimeText', align: 'center' },
                    { text: 'Halt', value: 'haltText', align: 'center' }
                ],
                defaultItem: {
                    _id: '',
                    orderNo: '',
                    station: {
                        _id: '',
                        name: ''
                    },
                    distance: 0,
                    arrivalDay: 1,
                    departureDay: 1,
                    arrivalTimeText: null,
                    departureTimeText: null,
                    halt: 0,
                    isSource: false,
                    isDestination: false,
                    stationTypeRadio: 'internal'
                },
                stationsSelectItems: [],
                validationRules: {
                    'station._id': [
                        id => !!id || 'Station is required'
                    ],
                    'distance': [
                        dist => (!!dist || dist === 0) || 'Distance is required',
                        dist => dist >= 0 || 'Distance must be 0 or greater than 0',
                    ],
                    'arrivalDay': [
                        day => !!day || 'Arrival day is required',
                        day => day > 0 || 'Arrival day must be greater than 0'
                    ],
                    'departureDay': [
                        day => !!day || 'Departure day is required',
                        day => day > 0 || 'Departure day must be greater than 0'
                    ]
                }
            }
        },
        async created() {
            this.service.init(this.items);

            const stations = await this.stationService.index();

            stations.sort((a, b) => {
                const A = a.name.toUpperCase(), B = b.name.toUpperCase();
                return A < B ? -1 : (A > B ? 1 : 0);
            });

            stations.forEach( (station) => {
                this.stationsSelectItems.push({
                    value: station._id,
                    text: station.name
                });
            });
        },
        methods: {
            onServerError(errorMessage) {
                this.$emit('serverError', errorMessage);
            },

            notifyChangedRouteStations() {
                const newRouteStations = this.service.index();
                this.$emit('changedRouteStations', newRouteStations);
            },

            onTimePickerChanged(editedItem, event) {

                switch (event.name) {
                    case 'arrTimeRouteStation':
                        editedItem.arrivalTimeText = event.newTime;
                        break;
                    case 'depTimeRouteStation':
                        editedItem.departureTimeText = event.newTime;
                        break;
                }
            },

            onRadioChange(editedItem) {

                switch (editedItem.stationTypeRadio) {
                    case 'source':
                        editedItem.isSource = true;
                        editedItem.isDestination = false;
                        editedItem.distance = 0;
                        editedItem.arrivalTimeText = null;
                        break;

                    case 'internal':
                        editedItem.isSource = false;
                        editedItem.isDestination = false;
                        break;

                    case 'destination':
                        editedItem.isSource = false;
                        editedItem.isDestination = true;
                        editedItem.departureTimeText = null;
                        break;
                }
            }
        }
    }
</script>

<style scoped>

</style>