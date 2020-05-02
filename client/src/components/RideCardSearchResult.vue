<template>
    <v-row>
        <v-col>
            <v-card>
                <v-card-text>
                    <v-row no-gutters>
                        <v-col>
                            <v-row justify="start" no-gutters>
                                <v-col cols="auto">
                                    <h2 class="title font-weight-bold">Departure</h2>
                                    <h3 class="subtitle-2 font-weight-bold">{{ departureDate }}</h3>
                                    <h1 class="display-1 font-weight-bold">{{ departureTime }}</h1>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col>
                            <v-row justify="center" no-gutters>
                                <v-col cols="auto">
                                    <v-row justify="center" no-gutters>
                                        <h1 class="headline font-weight-bold">
                                            {{ distance }} Km, {{ spentTime }}
                                        </h1>
                                    </v-row>
                                    <v-row justify="center" no-gutters>
                                        <h1 class="title font-weight-bold">Train {{ train }}</h1>
                                    </v-row>
                                    <v-row justify="center" no-gutters>
                                        <h3 class="subtitle-1 font-weight-bold">
                                            Services: {{ availableTravelClasses }}
                                        </h3>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col>
                            <v-row justify="end" no-gutters>
                                <v-col cols="auto">
                                    <v-row justify="end" no-gutters>
                                        <h2 class="title font-weight-bold">Arrival</h2>
                                    </v-row>
                                    <v-row justify="end" no-gutters>
                                        <h3 class="subtitle-2 font-weight-bold">{{ arrivalDate }}</h3>
                                    </v-row>
                                    <v-row justify="end" no-gutters>
                                        <h1 class="display-1 font-weight-bold">{{ arrivalTime }}</h1>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-row no-gutters v-show="showRouteStations" class="mt-4 mx-5 mb-2">
                    <v-col>
                        <v-stepper>
                            <v-stepper-header class="elevation-0">
                                <template v-for="station in ride.routeStations">
                                    <v-stepper-step
                                        :key="station._id"
                                        :complete="isStationStepComplete(station)"
                                        step=""
                                    >
                                        {{ station.station.name }}
                                        <small>{{ showTimeForStationOnStepper(station) }}</small>
                                    </v-stepper-step>

                                    <v-divider
                                        v-if="station.orderNo !== ride.routeStations.length"
                                        :key="station.orderNo"
                                    ></v-divider>
                                </template>
                            </v-stepper-header>
                        </v-stepper>
                    </v-col>
                </v-row>
                <v-card-actions class="mt-1">
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        class="body-1 text-capitalize px-5 mr-3"
                        outlined
                        @click="showRouteStations = !showRouteStations"
                    >
                        Show Route Stations
                    </v-btn>
                    <v-btn color="primary" class="body-1 text-capitalize px-5">Book this ride</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    const dateFormat = require('dateformat');

    export default {
        name: "RideCardSearchResult",
        props: {
            ride: Object,
            departureStation: Object,
            arrivalStation: Object
        },
        data() {
            return {
                departureDate: '',
                departureTime: '',
                arrivalDate: '',
                arrivalTime: '',
                distance: 0,
                spentTime: '',
                train: '',
                availableTravelClasses: '',
                showRouteStations: false,
                departureStationOrderNo: 0,
                arrivalStationOrderNo: 0
            };
        },
        created() {
            // departure/arrival times
            const departureRouteStation = this.ride.routeStations.find(routeStation => {
                return routeStation.station._id === this.departureStation._id;
            });

            const arrivalRouteStation = this.ride.routeStations.find(routeStation => {
                return routeStation.station._id === this.arrivalStation._id;
            });

            this.departureStationOrderNo = departureRouteStation.orderNo;
            this.arrivalStationOrderNo = arrivalRouteStation.orderNo;
            const depStationIndex = departureRouteStation.orderNo - 1;
            const arrStationIndex = arrivalRouteStation.orderNo - 1;
            const depDateFromMySource = new Date(this.ride.departureDates[depStationIndex]);
            const arrDateToMyDestination = new Date(this.ride.arrivalDates[arrStationIndex]);

            this.departureDate = dateFormat(depDateFromMySource, 'dd mmmm yyyy');
            this.departureTime = dateFormat(new Date(departureRouteStation.departureTime), 'HH:MM');
            this.arrivalDate = dateFormat(arrDateToMyDestination, 'dd mmmm yyyy');
            this.arrivalTime = dateFormat(new Date(arrivalRouteStation.arrivalTime), 'HH:MM');

            // distance and spent time on traveling
            this.distance = arrivalRouteStation.distance - departureRouteStation.distance;

            const spentTimeMs = arrDateToMyDestination - depDateFromMySource;
            const hours = Number.parseInt(spentTimeMs / 1000 / 60 / 60);
            const minutes = Number.parseInt(spentTimeMs / 1000 / 60);

            this.spentTime = hours > 0 && (minutes % 60) > 0 ? hours + ' h ' + (minutes % 60) + ' min' :
                hours > 0 && !(minutes % 60) ? hours + ' h' :
                    !hours && (minutes % 60) > 0 ? (minutes % 60) + ' min' : 'IMMEDIATELY';

            // train and classes details
            this.train = this.ride.route.train.trainCategory.code + ' ' + this.ride.route.train.number;

            this.availableTravelClasses = [... new Set(this.ride.cars.map(car => car.travelClass.name))].join(', ');
        },

        methods: {
            isStationStepComplete(station) {
                return station.orderNo >= this.departureStationOrderNo &&
                    station.orderNo <= this.arrivalStationOrderNo;
            },

            fromTimeDateToTimeText(time) {
                return dateFormat(new Date(time), 'HH:MM');
            },

            showTimeForStationOnStepper(routeStation) {

                if (routeStation.halt === 0 && routeStation.distance > 0) {
                    // this is the destination station
                    return this.fromTimeDateToTimeText(routeStation.arrivalTime) + ' (Arrival)';
                }

                return this.fromTimeDateToTimeText(routeStation.departureTime);
            }
        }
    }
</script>

<style scoped>

</style>