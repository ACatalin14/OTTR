<template>
    <GrayContainer class="fill-height">
        <v-row class="ma-0 pa-0">
            <h1 class="headline font-weight-black mt-2 pa-0"> {{ title }} </h1>
            <v-spacer></v-spacer>
            <v-btn
                v-if="$vuetify.breakpoint.smAndUp"
                color="error"
                outlined
                class="ma-0 mr-4"
                :to="{ name: 'routes' }"
            >
                <strong>Cancel</strong>
            </v-btn>
            <v-btn
                v-if="$vuetify.breakpoint.smAndUp"
                color="primary"
                class="ma-0 mr-2"
                outlined
                :disabled="!routeFormValid || savingRoute"
                @click="saveRoute()"
            >
                <strong>Save route</strong>
            </v-btn>
            <v-btn
                v-if="$vuetify.breakpoint.xsOnly"
                color="error"
                icon
                :to="{ name: 'routes' }"
            >
                <v-icon>mdi-cancel</v-icon>
            </v-btn>
            <v-btn
                v-if="$vuetify.breakpoint.xsOnly"
                color="primary"
                icon
                :disabled="!routeFormValid || savingRoute"
                @click="saveRoute()"
            >
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <v-card>
            <v-progress-linear
                v-if="(editingRoute && loadingRouteDetails) || savingRoute"
                indeterminate
            ></v-progress-linear>
            <v-tabs grow center-active>
                <v-tab>
                    <v-icon left>mdi-clock-outline</v-icon>
                    Time Details
                </v-tab>
                <v-tab>
                    <v-icon left>mdi-city</v-icon>
                    Stations
                </v-tab>
                <v-tab>
                    <v-icon left>mdi-train</v-icon>
                    Train & Cars
                </v-tab>

                <v-tab-item>
                    <v-form
                        v-model="timeDetailsFormValid"
                        ref="timeDetailsForm"
                        lazy-validation
                    >
                        <v-card flat>
                            <v-card-text class="pl-7">
                                <v-row>
                                    <v-col cols="12" sm="4" md="2">
                                        <v-text-field
                                            value="1"
                                            label="Departure Day"
                                            type="number"
                                            prepend-icon="mdi-clock-start"
                                            disabled
                                        ></v-text-field>

                                    </v-col>
                                    <v-col cols="12" sm="4" md="3">
                                        <v-dialog
                                            ref="depTimeDialog"
                                            v-model="depTimeDialog"
                                            :return-value.sync="depTimeText"
                                            persistent
                                            width="290px"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    v-model="depTimeText"
                                                    label="Departure Time"
                                                    prepend-icon="mdi-clock"
                                                    readonly
                                                    v-on="on"
                                                    :rules="departureTimeRules"
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                v-if="depTimeDialog"
                                                v-model="depTimeText"
                                                full-width
                                            >
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="depTimeDialog = false">Cancel</v-btn>
                                                <v-btn text color="primary" @click="$refs.depTimeDialog.save(depTimeText)">OK</v-btn>
                                            </v-time-picker>
                                        </v-dialog>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="4" md="2">
                                        <v-text-field
                                            v-model.number="arrivalDay"
                                            value="1"
                                            label="Arrival Day"
                                            type="number"
                                            prepend-icon="mdi-clock-end"
                                            :rules="arrivalDayRules"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="4" md="3">
                                        <v-dialog
                                            ref="arrTimeDialog"
                                            v-model="arrTimeDialog"
                                            :return-value.sync="arrTimeText"
                                            persistent
                                            width="290px"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    v-model="arrTimeText"
                                                    label="Arrival Time"
                                                    prepend-icon="mdi-clock"
                                                    readonly
                                                    v-on="on"
                                                    :rules="arrivalTimeRules"
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                v-if="arrTimeDialog"
                                                v-model="arrTimeText"
                                                full-width
                                            >
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="arrTimeDialog = false">Cancel</v-btn>
                                                <v-btn text color="primary"
                                                       @click="$refs.arrTimeDialog.save(arrTimeText)"
                                                >
                                                    OK
                                                </v-btn>
                                            </v-time-picker>
                                        </v-dialog>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="8">
                                        <v-select
                                            v-model="route.activeWeekDays"
                                            :items="activeDaysItems"
                                            label="Days of the week when the route is active"
                                            chips
                                            multiple deletable-chips
                                        ></v-select>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-form>
                </v-tab-item>
                <v-tab-item class="pa-5">
                    <RouteStationsPanel
                        :items="route.routeStations"
                        :route-departure-time="depTimeText"
                        :route-arrival-day="arrivalDay"
                        :route-arrival-time="arrTimeText"
                        @changedRouteStations="onChangeRouteStations"
                    ></RouteStationsPanel>
                </v-tab-item>
                <v-tab-item class="pa-5">
                    <TrainCarsPanel
                        :carTemplates="route.carTemplates"
                        :train="route.train"
                        :route-stations="route.routeStations"
                        @changedCarTemplates="onChangeCarTemplates"
                        @changedTrain="onChangeTrain"
                    >
                    </TrainCarsPanel>
                </v-tab-item>
            </v-tabs>
        </v-card>
    </GrayContainer>
</template>

<script>
    import GrayContainer from "../components/GrayContainer";
    import RouteServce from "../services/routeService";
    import RouteStationsPanel from "../components/RouteStationsPanel";
    import TrainCarsPanel from "../components/TrainCarsPanel";

    export default {
        name: "RoutesForm",
        components: {
            TrainCarsPanel,
            RouteStationsPanel,
            GrayContainer,
        },
        data() {
            return {
                service: RouteServce,
                routeFormValid: true,
                timeDetailsFormValid: true,
                editingRoute: false,
                oldDbRoute: {},
                depTimeDialog: false,
                depTimeText: null,
                arrivalDay: 1,
                arrTimeDialog: false,
                arrTimeText: null,
                savingRoute: false,
                loadingRouteDetails: true,
                activeDaysItems: [
                    { value: 1, text: 'Monday' },
                    { value: 2, text: 'Tuesday' },
                    { value: 3, text: 'Wednesday' },
                    { value: 4, text: 'Thursday' },
                    { value: 5, text: 'Friday' },
                    { value: 6, text: 'Saturday' },
                    { value: 0, text: 'Sunday' },
                ],
                route: {
                    departureTime: null,
                    arrivalTime: null,
                    activeWeekDays: [],
                    noOfGeneratedRides: 0,
                    generateRidesFrom: null,
                    generateRidesUntil: null,
                    train: null,
                    carTemplates: [],
                    routeStations: []
                },
                arrivalDayRules: [
                    day => !!day || 'Arrival day is required',
                    day => day > 0 || 'Arrival day must be greater than 0'
                ],
                departureTimeRules: [
                    time => !!time || 'Departure time is required',
                ],
                arrivalTimeRules: [
                    time => !!time || 'Arrival time is required',
                ]
            }
        },
        async created() {
            if (this.$route.name === 'routesCreate') {
                this.loadingRouteDetails = false;
                return;
            }

            if (this.$route.name === 'routesEdit') {

                const dateFormat = require('dateformat');
                this.editingRoute = true;
                const utcRouteName = this.service.getUTCRouteName(this.$route.params.routeName);
                this.oldDbRoute = await this.service.getByName(utcRouteName);

                // Time Details
                this.depTimeText = dateFormat(this.oldDbRoute.departureTime, 'HH:MM');
                this.arrTimeText = dateFormat(this.oldDbRoute.arrivalTime, 'HH:MM');

                this.arrivalDay = new Date(this.oldDbRoute.arrivalTime).getDate();
                this.route.activeWeekDays = JSON.parse(JSON.stringify(this.oldDbRoute.activeWeekDays));

                // Route Stations
                this.route.routeStations = JSON.parse(JSON.stringify(this.oldDbRoute.routeStations));

                // Train & Car Templates
                this.route.carTemplates = JSON.parse(JSON.stringify(this.oldDbRoute.carTemplates));
                this.route.train = JSON.parse(JSON.stringify(this.oldDbRoute.train));

                this.loadingRouteDetails = false;
            }
        },
        watch: {

        },
        computed: {
            title() {
                return this.editingRoute ? 'Edit Route' : 'New Route';
            },

            departureDateTime() {
                if (!this.depTimeText) {
                    return null;
                }

                const depDate = new Date(2000, 0, 1);
                const hours = this.depTimeText.substr(0, 2);
                const minutes = this.depTimeText.substr(3, 2);
                depDate.setHours(hours);
                depDate.setMinutes(minutes);

                return depDate.getTime();
            },

            arrivalDateTime() {
                if (!this.arrTimeText) {
                    return null;
                }

                const arrDate = new Date(2000, 0, 1);
                const hours = this.arrTimeText.substr(0, 2);
                const minutes = this.arrTimeText.substr(3, 2);
                arrDate.setHours(hours);
                arrDate.setMinutes(minutes);

                arrDate.setDate(arrDate.getDate() + this.arrivalDay - 1);

                return arrDate.getTime();
            },

            trainFormValid() {

                return !!this.route.train &&
                    !!this.route.train.number &&
                    this.route.train.number > 0 &&
                    !!this.route.train.trainCategory &&
                    !!this.route.train.trainCategory._id &&
                    !!this.route.train.trainCategory.code;
            }

        },
        methods: {

            async saveRoute() {

                try {
                    if (!this.$refs.timeDetailsForm.validate()) {
                        this.timeDetailsFormValid = false;
                        return;
                    }

                    this.route.departureTime = this.departureDateTime;
                    this.route.arrivalTime = this.arrivalDateTime;
                    this.route.activeWeekDays.sort( (a, b) => a.value - b.value );

                    // TODO: use a validation function where all goes there using just this.route
                    //       OR use computed properties like trainFormValid
                    if (this.route.routeStations.length < 2) {
                        this.$emit('serverError', 'This route needs at least 2 stations!');
                        return;
                    }

                    this.route.routeStations.forEach( routeStation => {
                        routeStation.stationId = routeStation.station._id;
                    });

                    if (!this.trainFormValid) {
                        this.$emit('serverError', 'Train details not valid!');
                        return;
                    }

                    if (!this.route.carTemplates.length) {
                        this.$emit('serverError', 'This train needs at least one car!');
                        return;
                    }

                    this.route.train.trainCategoryId = this.route.train.trainCategory._id;

                    this.route.carTemplates.forEach( carTemplate => {
                        carTemplate.departureStationId = carTemplate.departureStation.station._id;
                        carTemplate.arrivalStationId = carTemplate.arrivalStation.station._id;
                        carTemplate.travelClassId = carTemplate.travelClass._id;
                        carTemplate.carLayoutId = carTemplate.carLayout._id;
                    });

                    if (this.route.generateRidesUntil) {

                        this.route.generateRidesUntil = new Date(this.route.generateRidesUntil);
                        this.route.generateRidesUntil.setHours(23);
                        this.route.generateRidesUntil.setMinutes(59);
                        this.route.generateRidesUntil.setSeconds(59);
                        this.route.generateRidesUntil.setMilliseconds(999);
                        this.route.generateRidesUntil = this.route.generateRidesUntil.getTime();
                    }

                    this.savingRoute = true;

                    if (this.editingRoute) {
                        this.route._id = this.oldDbRoute._id;
                        await this.service.update(this.route);
                        await this.$store.dispatch('showNotification', {
                            msg: 'Route has been successfully saved.'
                        });
                    } else {
                        await this.service.create(this.route);
                        await this.$store.dispatch('showNotification', {
                            msg: 'New Route has been successfully created.'
                        });

                    }

                    await this.$router.push({ name: 'routes' });
                } catch (error) {
                    console.error(error);
                    this.$emit('serverError', error.response.data.err.message);
                }

                this.savingRoute = false;
            },

            onChangeRouteStations(routeStations) {

                this.route.routeStations = routeStations;
            },

            onChangeCarTemplates(carTemplates) {

                this.route.carTemplates = carTemplates;
            },

            onChangeTrain(train) {

                this.route.train = train;
            }
        }
    }
</script>

<style scoped>

</style>