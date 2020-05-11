<template>
    <GrayContainer>
        <v-row v-if="rideNotFound">
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <v-row justify="center">
                            Uh Oh...
                        </v-row>
                    </v-card-title>
                    <v-card-subtitle class="pt-2 pb-5">
                        <v-row justify="center">
                            No ride was found in order to match the given criteria. <br/>
                            Try searching for another date or give up any optional filters.
                        </v-row>
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
        <div
            v-if="rideFound"
        >
            <v-row
                class="ma-0 pa-0 mb-3"
            >
                <v-col cols="12" md="auto" class="pt-0">
                    <h1 class="heading font-weight-black mt-2 pa-0">
                        Book Ride
                    </h1>
                </v-col>
                <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>
                <v-col cols="12" md="auto" class="pt-0">
                    <v-row no-gutters justify-md="center">
                        <h1 class="heading font-weight-black mt-2 pa-0">
                            <span v-html="pageTitle"></span>
                        </h1>
                    </v-row>
                </v-col>
                <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>
                <v-col cols="12" md="auto" class="pt-0">
                    <v-row no-gutters justify-md="end">
                        <h1 class="heading font-weight-black mt-2 pa-0"> {{ rideDateString }}</h1>
                    </v-row>
                </v-col>
            </v-row>
            <v-stepper
                v-model="currentStepperStep"
            >
                <v-stepper-header>
                    <template v-for="formStep in formHeaderSteps">
                        <v-stepper-step
                            :key="formStep.orderNo"
                            :complete="formStep.orderNo < currentStepperStep"
                            :step="formStep.orderNo"
                        >
                            {{ formStep.title }}
                        </v-stepper-step>

                        <v-divider
                            v-if="formStep.orderNo !== formHeaderSteps.length"
                            :key="formStep.title"
                        ></v-divider>
                    </template>
                </v-stepper-header>
                <v-stepper-items>
                    <v-stepper-content :step="formHeaderSteps[0].orderNo" class="pt-4">
                        <v-row no-gutters>
                            <v-spacer></v-spacer>
                            <v-col cols="auto">
                                <v-row>
                                    <v-col cols="auto">
                                        <v-btn
                                            icon
                                            color="accent"
                                            @click="decrementAvailableCarIfPossible()"
                                            :disabled="currentDisplayedCarIndex === 0"
                                        >
                                            <v-icon>mdi-chevron-left</v-icon>
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-row no-gutters justify="center">
                                            <h2 class="title font-weight-black">Car {{ availableCars[currentDisplayedCarIndex].number }}</h2>
                                        </v-row>
                                        <v-row no-gutters justify="center">
                                            {{ availableCars[currentDisplayedCarIndex].travelClass.name }}
                                        </v-row>
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-btn
                                            icon
                                            color="accent"
                                            @click="incrementAvailableCarIfPossible()"
                                            :disabled="currentDisplayedCarIndex === this.availableCars.length - 1"
                                        >
                                            <v-icon>mdi-chevron-right</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>

                                <v-row no-gutters justify="center">

                                </v-row>
                            </v-col>
                            <v-spacer></v-spacer>
                        </v-row>
                        <v-row no-gutters style="overflow: auto" class="mt-3">
                            <v-spacer></v-spacer>
                            <v-col cols="auto">
                                <CarLayoutWithSelectableSeats
                                    :car-layout="currentDisplayedCarLayout"
                                    @toggledSeat="toggleSelectedSeat"
                                ></CarLayoutWithSelectableSeats>
                            </v-col>
                            <v-spacer></v-spacer>
                        </v-row>
                        <v-row no-gutters class="mt-7">
                            <v-spacer></v-spacer>
                            <v-btn
                                color="primary"
                                :disabled="seatsNotPicked"
                                @click="currentStepperStep++"
                            >
                                Next Step
                            </v-btn>
                        </v-row>
                    </v-stepper-content>
                    <v-stepper-content :step="formHeaderSteps[1].orderNo">

                    </v-stepper-content>
                    <v-stepper-content :step="formHeaderSteps[2].orderNo">

                    </v-stepper-content>
                    <v-stepper-content :step="formHeaderSteps[3].orderNo">

                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </div>
    </GrayContainer>
</template>

<script>
    import RideService from "../services/rideService";
    import StationService from "../services/stationService";
    import CarLayoutService from "../services/carLayoutService";
    import GrayContainer from "../components/GrayContainer";
    import CarLayoutWithSelectableSeats from "../components/CarLayoutWithSelectableSeats";

    const queryString = require('query-string');
    const dateFormat = require('dateformat');

    export default {
        name: "RideBookingPage",
        components: {CarLayoutWithSelectableSeats, GrayContainer},
        data() {
            return {
                ride: null,
                departureStation: null,
                destinationStation: null,
                rideDateString: '',
                rideNotFound: false,
                rideFound: false,
                departureTime: null,
                arrivalTime: null,
                departureTimeText: '',
                arrivalTimeText: '',
                currentStepperStep: 1,
                tickets: [],
                availableCarsDbSynced: [],
                availableCars: [],
                currentDisplayedCarIndex: 0,
                currentDisplayedCarLayout: null,
                ownSelectedSeats: [],
                formHeaderSteps: [
                    { orderNo: 1, title: 'Pick Your Seats' },
                    { orderNo: 2, title: 'Passenger Types' },
                    { orderNo: 3, title: 'Confirmation' },
                    { orderNo: 4, title: 'Finished' }
                ]
            };
        },

        computed: {
            pageTitle() {
                if (!this.departureStation || !this.destinationStation || !this.rideDateString) {
                    return '';
                }

                let title = '';
                title += '<em style="color: darkblue">' + this.departureStation.name + '</em> ';
                title += '(' + this.departureTimeText + ') ';
                title += '<i class="fa fa-long-arrow-right"></i> ';
                title += '<em style="color: darkblue">' + this.destinationStation.name + '</em> ';
                title += '(' + this.arrivalTimeText + ') ';

                return title;
            },

            seatsNotPicked() {
                return this.ownSelectedSeats.length === 0;
            }
        },

        watch: {
            '$vuetify.breakpoint.xsOnly': {
                handler() {
                    if (!this.availableCars.length) {
                        return;
                    }

                    this.updateCurrentDisplayedCarLayout();
                }
            }
        },

        async created() {

            try {

                let queryDetails = queryString.parse('?' + this.$route.params.details), hours, minutes;

                if ([queryDetails.from,
                    queryDetails.to,
                    queryDetails.date,
                    queryDetails.departureTime,
                    queryDetails.arrivalTime
                ].includes(undefined)
                ) {

                    await this.$router.push({ name: 'pageNotFound' });
                }

                this.departureStation = await StationService.getStationByCode(queryDetails.from);
                this.destinationStation = await StationService.getStationByCode(queryDetails.to);
                this.rideDateString = dateFormat(new Date(queryDetails.date), 'dd mmmm yyyy');

                this.departureTime = new Date(2000, 0, 1);
                hours = queryDetails.departureTime.substr(0, 2);
                minutes = queryDetails.departureTime.substr(3, 2);
                this.departureTime.setHours(hours, minutes, 0, 0);
                this.departureTimeText = dateFormat(this.departureTime, 'HH:MM');

                this.arrivalTime = new Date(2000, 0, 1);
                hours = queryDetails.arrivalTime.substr(0, 2);
                minutes = queryDetails.arrivalTime.substr(3, 2);
                this.arrivalTime.setHours(hours, minutes, 0, 0);
                this.arrivalTimeText = dateFormat(this.arrivalTime, 'HH:MM');

                const details = {
                    sourceId: this.departureStation._id,
                    destinationId: this.destinationStation._id,
                    date: (new Date(queryDetails.date)).getTime(),
                    departureTime: this.departureTime.getTime(),
                    arrivalTime: this.arrivalTime.getTime(),
                };

                this.ride = await RideService.getRideByDetails(details);

                this.rideNotFound = (this.ride === null);
                this.rideFound = (this.ride !== null);

                if (this.rideNotFound) {
                    return;
                }

                this.availableCarsDbSynced = RideService.getCarsContainingSourceDestination(
                    this.ride,
                    this.departureStation._id,
                    this.destinationStation._id
                );

                this.availableCars = JSON.parse(JSON.stringify(this.availableCarsDbSynced));

                this.updateCurrentDisplayedCarLayout();

            } catch (error) {

                this.rideNotFound = true;
                this.rideFound = false;

                console.error(error);
                this.$emit('serverError', error.response.data.err.message);
            }
        },

        methods: {
            decrementAvailableCarIfPossible() {
                if (this.currentDisplayedCarIndex === 0) {
                    return;
                }

                this.currentDisplayedCarIndex--;
                this.updateCurrentDisplayedCarLayout();
            },

            incrementAvailableCarIfPossible() {
                if (this.currentDisplayedCarIndex === this.availableCars.length - 1) {
                    return;
                }

                this.currentDisplayedCarIndex++;
                this.updateCurrentDisplayedCarLayout();
            },

            toggleSelectedSeat(seatNumber) {
                let seat = this.availableCars[this.currentDisplayedCarIndex].seats.find( seat => {
                    return seat.number === seatNumber;
                });

                if (!seat.selected) {
                    // TODO: request la backend
                    seat.selected = true;
                    this.ownSelectedSeats.push(seat);
                } else {
                    // TODO: request la backend
                    seat.selected = false;
                    console.log(seat._id);

                    const index = this.ownSelectedSeats.findIndex(s => s._id === seat._id);
                    this.ownSelectedSeats.splice(index, 1);
                }

                let seatOfCarLayout =
                    this.availableCars[this.currentDisplayedCarIndex].carLayout.elements.find( elem => {
                        return elem.seatNumber === seatNumber;
                    });

                if (seat.selected) {
                    seatOfCarLayout.type = CarLayoutService.getSelectedSeatTypeFromUnselected(seatOfCarLayout.type);
                } else {
                    seatOfCarLayout.type = CarLayoutService.getUnselectedSeatTypeFromSelected(seatOfCarLayout.type);
                }

                this.updateCurrentDisplayedCarLayout();
            },

            updateCurrentDisplayedCarLayout() {

                let displayedCarLayout = JSON.parse(JSON.stringify(
                    this.availableCars[this.currentDisplayedCarIndex].carLayout
                ));

                displayedCarLayout = CarLayoutService.transformFromMongo2FrontendModel(displayedCarLayout);

                if (this.$vuetify.breakpoint.xsOnly) {
                    displayedCarLayout = CarLayoutService.rotateCarLayout(displayedCarLayout);
                }

                const departureRouteStation = this.ride.routeStations.find(routeStation => {
                    return routeStation.station._id === this.departureStation._id;
                });

                const arrivalRouteStation = this.ride.routeStations.find(routeStation => {
                    return routeStation.station._id === this.destinationStation._id;
                });

                const currentCar = JSON.parse(JSON.stringify(
                    this.availableCars[this.currentDisplayedCarIndex]
                ));

                currentCar.carLayout = displayedCarLayout;

                this.currentDisplayedCarLayout = CarLayoutService.fillCarLayoutWithReservedSeats(
                    currentCar, departureRouteStation, arrivalRouteStation, this.ownSelectedSeats
                );
            }
        }
    }
</script>

<style scoped>

</style>