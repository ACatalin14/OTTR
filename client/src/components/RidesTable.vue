<template>
    <v-data-table
        :headers="tableHeaders"
        :items="items"
        :search="searchBar"
        :loading="loadingRides"
        sort-by="name"
        class="elevation-3"
        no-results-text="No rides have been found for this route"
    >
        <template v-slot:top>
            <v-toolbar flat color="white" :class="tallToolbar">
                <v-row class="ma-0 pa-0">
                    <v-col class="ma-0 pa-0">
                        <v-row class="ma-0 pa-0">
                            <v-toolbar-title class="headline indigo--text text-capitalize">
                                Rides
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-if="$vuetify.breakpoint.mdAndUp"
                                v-model="searchBar"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                                clearable
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="formDialog" max-width="500px" persistent>
                                <template v-slot:activator="{ on }">
                                    <div>
                                        <v-btn
                                            v-show="$vuetify.breakpoint.mdAndUp"
                                            color="primary"
                                            class="pl-2 pr-5 text-capitalize"
                                            outlined
                                            v-on="on"
                                        >
                                            <v-icon class="mr-2" >mdi-clock-outline</v-icon>
                                            <strong>Add New Rides</strong>
                                        </v-btn>
                                        <v-btn
                                            v-show="$vuetify.breakpoint.smAndDown"
                                            class="mt-n2 mr-n2"
                                            color="primary"
                                            icon
                                            v-on="on"
                                        >
                                            <v-icon>mdi-plus-circle</v-icon>
                                        </v-btn>
                                    </div>
                                </template>
                                <v-card v-if="formDialog" :loading="creatingRides">
                                    <v-form
                                        v-model="itemFormValid"
                                        ref="itemForm"
                                        lazy-validation
                                        @submit.prevent="createRides"
                                    >
                                        <v-card-title>
                                            <span class="headline text-capitalize"> Create New Rides </span>
                                        </v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text class="">
                                            <RidesForm
                                                @changedNoOfGeneratedRides="onChangeNoOfGeneratedRides"
                                                @changedGenerateRidesFrom="onChangeGenerateRidesFrom"
                                                @changedGenerateRidesUntil="onChangeGenerateRidesUntil"
                                            ></RidesForm>
                                        </v-card-text>
                                        <v-card-actions class="pt-0">
                                            <v-spacer></v-spacer>
                                            <v-btn color="error" text @click="closeForm">Cancel</v-btn>
                                            <v-btn color="primary" text :disabled="!itemFormValid || creatingRides" type="submit">
                                                Create
                                            </v-btn>
                                        </v-card-actions>
                                    </v-form>
                                </v-card>
                            </v-dialog>
                        </v-row>
                        <v-row
                            v-if="$vuetify.breakpoint.smAndDown"
                            class="ma-0 pa-0"
                        >
                            <v-text-field
                                v-model="searchBar"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                                clearable
                            ></v-text-field>
                        </v-row>
                    </v-col>
                </v-row>
            </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
            <v-icon
                small
                color="error"
                @click="deleteItem(item)"
            >
                mdi-delete
            </v-icon>
        </template>
        <template slot="no-data">
            <span> No rides available to display </span>
        </template>
    </v-data-table>
</template>

<script>
    import RouteRideService from '../services/routeRideService';
    import RouteService from '../services/routeService';
    import RidesForm from "./RidesForm";

    export default {
        name: "RidesTable",
        components: {RidesForm},
        props: {
            route: Object
        },
        data: () => ({
            searchBar: '',
            tableHeaders: [
                { text: 'Departure Date', value: 'depDateText', align: 'left' },
                { text: 'Departure Time', value: 'depTimeText', align: 'left' },
                { text: 'Arrival Date', value: 'arrDateText', align: 'left' },
                { text: 'Arrival Time', value: 'arrTimeText', align: 'left' },
                { text: 'Number of Cars', value: 'carsCount', align: 'left' },
                { text: 'Number of Stations', value: 'routeStationsCount', align: 'left' },
                { text: 'Actions', value: 'action', align: 'center', sortable: false }
            ],
            items: [],
            service: RouteRideService,
            formDialog: false,
            itemFormValid: true,
            creatingRides: false,
            utcRouteName: null,
            loadingRides: true,
            generateOptions: {
                noOfGeneratedRides: 0,
                generateRidesFrom: null,
                generateRidesUntil: null,
            }
        }),

        computed: {
            tallToolbar() {
                return {
                    'pt-6': this.$vuetify.breakpoint.smAndDown,
                    'mb-11': this.$vuetify.breakpoint.smAndDown
                }
            }
        },

        created () {
            this.initialize();
            this.setDateTimezonesMethods();
        },

        methods: {
            async initialize () {
                try {
                    this.utcRouteName = RouteService.getUTCRouteName(this.$route.params.routeName);
                    const dbItems = await this.service.getRidesForRoute(this.utcRouteName);
                    dbItems.forEach( dbItem => {
                        this.items.push(
                            this.service.attachFrontendFields2MongoFormat(dbItem)
                        )
                    });
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                this.loadingRides = false;
            },

            async deleteItem (item) {

                this.loadingRides = true;

                try {
                    this.utcRouteName = RouteService.getUTCRouteName(this.$route.params.routeName);
                    await this.service.delete(this.utcRouteName, item._id);
                    this.items = [];
                    const dbItems = await this.service.getRidesForRoute(this.utcRouteName);
                    dbItems.forEach( dbItem => {
                        this.items.push(
                            this.service.attachFrontendFields2MongoFormat(dbItem)
                        )
                    });
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                this.loadingRides = false;
            },

            async createRides() {

                try {
                    this.creatingRides = true;

                    const rideDates = this.calculateRideDates(
                        this.route.activeWeekDays,
                        this.route.departureTime,
                        this.route.arrivalTime,
                        this.generateOptions.noOfGeneratedRides,
                        this.generateOptions.generateRidesFrom,
                        this.generateOptions.generateRidesUntil,
                        this.route
                    );

                    await this.service.createRides(this.route._id, rideDates);

                    await this.$store.dispatch('showNotification', {
                        msg: 'New Rides have been successfully created.'
                    });

                    this.items = [];
                    const dbItems = await this.service.getRidesForRoute(this.utcRouteName);
                    dbItems.forEach( dbItem => {
                        this.items.push(
                            this.service.attachFrontendFields2MongoFormat(dbItem)
                        )
                    });

                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                this.closeForm();
            },

            closeForm() {
                this.formDialog = false;
                this.creatingRides = false;
            },

            onChangeNoOfGeneratedRides(no) {

                this.generateOptions.noOfGeneratedRides = no;
            },

            onChangeGenerateRidesFrom(startDate) {

                this.generateOptions.generateRidesFrom = startDate ? (new Date(startDate)).getTime() : null;
            },

            onChangeGenerateRidesUntil(endDate) {

                this.generateOptions.generateRidesUntil = endDate ? (new Date(endDate)).getTime() : null;
            },

            /**
             * noOfRides -> generate the next daily noOfRides starting from today
             * noOfRides + ridesDateFrom -> generate the next daily noOfRides starting from ridesDateFrom
             * noOfRides + ridesDateUntil -> generate the next daily noOfRides starting from today until ridesDateUntil (without passing this date)
             * noOfRides + ridesDateFrom + ridesDateUntil -> generate noOfRides rides between those dates
             * ridesDateFrom + ridesDateUntil -> generate all daily rides from startDate until finishDate
             * ridesDateUntil -> generate all daily rides from today until ridesDateUntil
             *
             * @param activeWeekDays
             * @param departureTime
             * @param arrivalTime
             * @param noOfRides
             * @param ridesDateFrom
             * @param ridesUntilDate
             * @param route
             */
            calculateRideDates(activeWeekDays, departureTime, arrivalTime, noOfRides, ridesDateFrom, ridesUntilDate, route) {
                let rideDates = [];

                if (!noOfRides) {
                    noOfRides = 999999;
                }

                if (!ridesDateFrom) {
                    ridesDateFrom = Date.now();
                }
                ridesDateFrom = new Date(ridesDateFrom);

                if (!ridesUntilDate) {
                    ridesUntilDate = new Date('1.1.9999');
                }
                ridesUntilDate = new Date(ridesUntilDate);
                ridesUntilDate.setHours(23, 59, 59, 999);

                departureTime = new Date(departureTime);
                arrivalTime = new Date(arrivalTime);

                // check if today should be included in ride dates
                let todayDepDateTime = new Date();
                todayDepDateTime.setHours(departureTime.getHours(), departureTime.getMinutes(), 0, 0);

                if (ridesDateFrom.getDate() === todayDepDateTime.getDate() &&
                    ridesDateFrom.getMonth() === todayDepDateTime.getMonth() &&
                    ridesDateFrom.getFullYear() === todayDepDateTime.getFullYear()
                ) {
                    if (ridesDateFrom < todayDepDateTime && activeWeekDays.includes(todayDepDateTime.getDay())) {

                        const dayDiff = arrivalTime.getDate() - departureTime.getDate();
                        const todayArrDateTime = new Date(todayDepDateTime);
                        todayArrDateTime.setHours(arrivalTime.getHours(), arrivalTime.getMinutes(), 0, 0);

                        todayArrDateTime.setDate(todayDepDateTime.getDate() + dayDiff);

                        const departureDates = this.calculateDepartureDateTimesForRide(
                            todayDepDateTime, route.routeStations
                        );
                        const arrivalDates = this.calculateArrivalDateTimesForRide(
                            todayArrDateTime, route.routeStations
                        );

                        rideDates.push({
                            departureDates: departureDates, //todayDepDateTime,
                            arrivalDates: arrivalDates // todayArrDateTime
                        });
                    }

                    ridesDateFrom.setDate(ridesDateFrom.getDate() + 1);
                }

                // search for next ride dates
                let currentDepDate = new Date(ridesDateFrom);
                currentDepDate.setHours(departureTime.getHours(), departureTime.getMinutes(), 0, 0);

                while (currentDepDate < ridesUntilDate && noOfRides > 0) {

                    if (activeWeekDays.includes( currentDepDate.getDay() )) {

                        const dayDiff = arrivalTime.getDate() - departureTime.getDate();
                        const currentArrDate = new Date(currentDepDate);
                        currentArrDate.setHours(arrivalTime.getHours(), arrivalTime.getMinutes(), 0, 0);

                        currentArrDate.setDate(currentDepDate.getDate() + dayDiff);

                        const departureDates = this.calculateDepartureDateTimesForRide(
                            currentDepDate, route.routeStations
                        );
                        const arrivalDates = this.calculateArrivalDateTimesForRide(
                            currentDepDate, route.routeStations
                        );

                        rideDates.push({
                            departureDates: departureDates, //new Date(currentDepDate),
                            arrivalDates: arrivalDates // new Date(currentArrDate)
                        });

                        noOfRides--;
                    }

                    currentDepDate.setDate(currentDepDate.getDate() + 1);
                }

                return rideDates;
            },

            /**
             *
             * @param depDate
             * @param routeStations
             * @returns {[]}
             */
            calculateDepartureDateTimesForRide(depDate, routeStations) {

                const departureDate = new Date(depDate);
                const departureTimes = routeStations.map(routeStation => {
                    return new Date(routeStation.departureTime);
                });

                let departureDates = [];
                departureTimes.forEach(depTime => {
                    if (depTime - new Date(0) === 0) {
                        // this is the destination station
                        departureDates.push(new Date(0));
                        return;
                    }

                    const dayDiff = depTime.getDate() - 1;

                    let departureDateForThisStation = new Date(departureDate);
                    departureDateForThisStation.setDate(departureDate.getDate() + dayDiff);
                    departureDateForThisStation.setHours(depTime.getHours(), depTime.getMinutes(), 0, 0);

                    departureDates.push(departureDateForThisStation);
                });

                return departureDates;
            },

            /**
             *
             * @param depDate
             * @param routeStations
             * @returns {[]}
             */
            calculateArrivalDateTimesForRide(depDate, routeStations) {

                const departureDate = new Date(depDate);
                const arrivalTimes = routeStations.map(routeStation => {
                    return new Date(routeStation.arrivalTime);
                });

                let arrivalDates = [];
                arrivalTimes.forEach(arrTime => {
                    if (arrTime - new Date(0) === 0) {
                        // this is the source station
                        arrivalDates.push(new Date(0));
                        return;
                    }

                    const dayDiff = arrTime.getDate() - 1;

                    let arrivalDateForThisStation = new Date(departureDate);
                    arrivalDateForThisStation.setDate(departureDate.getDate() + dayDiff);
                    arrivalDateForThisStation.setHours(arrTime.getHours(), arrTime.getMinutes(), 0, 0);

                    arrivalDates.push(arrivalDateForThisStation);
                });

                return arrivalDates;
            },

            setDateTimezonesMethods() {

                Date.prototype.stdTimezoneOffset = function () {
                    var jan = new Date(this.getFullYear(), 0, 1);
                    var jul = new Date(this.getFullYear(), 6, 1);
                    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
                };

                Date.prototype.isDstObserved = function () {
                    return this.getTimezoneOffset() < this.stdTimezoneOffset();
                }
            }
        }
    }
</script>
