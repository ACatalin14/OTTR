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
                    <v-stepper-content
                        :step="formHeaderSteps[0].orderNo"
                        class="pt-4"
                    >
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
                                            <h2
                                                v-if="availableCarsExist"
                                                class="title font-weight-black"
                                            >
                                                Car {{ availableCars[currentDisplayedCarIndex].number }}
                                            </h2>
                                        </v-row>
                                        <v-row
                                            v-if="availableCarsExist"
                                            no-gutters justify="center"
                                        >
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
                            </v-col>
                            <v-spacer></v-spacer>
                        </v-row>
                        <v-row no-gutters style="overflow: auto" class="mt-3">
                            <v-spacer></v-spacer>
                            <v-col cols="auto">
                                <CarLayoutWithSelectableSeats
                                    v-if="availableCarsExist"
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
                        <PassengerTypesFormStep
                            :ride-distance="distance"
                            :available-cars="availableCars"
                            :tickets="requestedTickets"
                            @changedTickets="onChangeTickets"
                            @nextBookingStep="onNextBookingStep"
                            @previousBookingStep="onPreviousBookingStep"
                        >
                        </PassengerTypesFormStep>
                    </v-stepper-content>
                    <v-stepper-content :step="formHeaderSteps[2].orderNo">
                        <ConfirmationBookingStep
                            :paypal-props="paypalData"
                            :available-cars="availableCars"
                            :tickets="requestedTickets"
                            :ride="ride"
                            :departure-station="departureStation"
                            :destination-station="destinationStation"
                            :departure-time-text="departureTimeText"
                            :arrival-time-text="arrivalTimeText"
                            :ride-date="rideDateString"
                            @nextBookingStep="onNextBookingStep"
                            @previousBookingStep="onPreviousBookingStep"
                            @paymentCompleted="onPaymentCompleted"
                        >
                        </ConfirmationBookingStep>
                    </v-stepper-content>
                    <v-stepper-content :step="formHeaderSteps[3].orderNo">
                        <v-row no-gutters v-if="finishedOrder">
                            Good Job! You order #{{ finishedOrder.number }} has been placed successfully.
                        </v-row>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </div>
    </GrayContainer>
</template>

<script>
    import CONSTANTS from "../constants";
    import RideService from "../services/rideService";
    import StationService from "../services/stationService";
    import CarLayoutService from "../services/carLayoutService";
    import SeatService from "../services/seatService";
    import ConfigService from "../services/configService";
    import OrderTicketService from "../services/orderTicketService";
    import GrayContainer from "../components/GrayContainer";
    import CarLayoutWithSelectableSeats from "../components/CarLayoutWithSelectableSeats";
    import PassengerTypesFormStep from "../components/PassengerTypesFormStep";
    import ConfirmationBookingStep from "../components/ConfirmationBookingStep";

    const queryString = require('query-string');
    const dateFormat = require('dateformat');

    export default {
        name: "RideBookingPage",
        components: {ConfirmationBookingStep, PassengerTypesFormStep, CarLayoutWithSelectableSeats, GrayContainer},
        data() {
            return {
                ride: null,
                detailsFromQuery: null,
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
                requestedTickets: [],
                availableCars: [],
                currentDisplayedCarIndex: 0,
                currentDisplayedCarLayout: null,
                toggleSeatsLock: false,
                selectedSeatsTimers: {},
                distance: 0,
                config: null,
                kmPrice: 0,
                finishedOrder: null,
                paypalData: {
                    paypalCredentials: {
                        sandbox: 'AVkWHFnXdZqeisrLgPWwUDeG7xGXQ-ONQjEL_01-LMBJAm0m9QuDO4a2CXLar3Kh1gWiYBq9k4cAGa4G',
                        production: ''
                    },
                    paypalButtonStyle: {
                        label: 'paypal',
                        size:  'responsive',
                        shape: 'rect',
                        color: 'silver',
                        tagline: false
                    },
                    items: []
                },
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
                return this.requestedTickets.length === 0;
            },

            availableCarsExist() {

                return this.availableCars.length > 0;
            }
        },

        watch: {
            '$vuetify.breakpoint.smAndDown': {
                async handler() {
                    if (!this.availableCars.length) {
                        return;
                    }

                    await this.updateAvailableCarsAndCurrentDisplayedCarLayout();
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

                this.detailsFromQuery = {
                    sourceId: this.departureStation._id,
                    destinationId: this.destinationStation._id,
                    date: (new Date(queryDetails.date)).getTime(),
                    departureTime: this.departureTime.getTime(),
                    arrivalTime: this.arrivalTime.getTime(),
                };

                this.ride = await RideService.getRideByDetails(this.detailsFromQuery);

                this.rideNotFound = (this.ride === null);
                this.rideFound = (this.ride !== null);

                if (this.rideNotFound) {
                    return;
                }

                await this.updateAvailableCarsAndCurrentDisplayedCarLayout();

                // calculate distance of this ride
                const departureRouteStation = this.ride.routeStations.find(routeStation => {
                    return routeStation.station._id === this.departureStation._id;
                });

                const arrivalRouteStation = this.ride.routeStations.find(routeStation => {
                    return routeStation.station._id === this.destinationStation._id;
                });

                this.distance = arrivalRouteStation.distance - departureRouteStation.distance;

                this.config = await ConfigService.getConfig();
                this.kmPrice = this.config.kmPrice;

            } catch (error) {

                this.rideNotFound = true;
                this.rideFound = false;

                console.error(error);
                this.$emit('serverError', error.response.data.err.message);
            }
        },

        destroyed() {

            for (let timerId in this.selectedSeatsTimers) {
                clearInterval(this.selectedSeatsTimers[timerId]);
            }
            this.selectedSeatsTimers = {};
        },

        methods: {
            async decrementAvailableCarIfPossible() {
                if (this.currentDisplayedCarIndex === 0) {
                    return;
                }

                this.currentDisplayedCarIndex--;
                await this.updateAvailableCarsAndCurrentDisplayedCarLayout();
            },

            async incrementAvailableCarIfPossible() {
                if (this.currentDisplayedCarIndex === this.availableCars.length - 1) {
                    return;
                }

                this.currentDisplayedCarIndex++;
                await this.updateAvailableCarsAndCurrentDisplayedCarLayout();
            },

            async toggleSelectedSeat(seatNumber) {

                if (this.toggleSeatsLock) {
                    return;
                }

                this.toggleSeatsLock = true;

                let seat = this.availableCars[this.currentDisplayedCarIndex].seats.find( seat => {
                    return seat.number === seatNumber;
                });

                try {

                    if (!seat.selected) {

                        await SeatService.selectSeat(seat._id);

                        this.selectedSeatsTimers[seat._id] = setInterval(
                            SeatService.preserveSeat,
                            CONSTANTS.SEAT_SELECTION_REFRESH_TIMEOUT,
                            seat._id
                        );

                        this.requestedTickets.push({
                            seat: seat,
                            passengerType: null,
                            price: 0
                        });

                        this.requestedTickets.sort((a, b) => a.seat.number - b.seat.number)

                    } else if (seat.selectingUser === this.$store.getters.getUser._id) {

                        clearInterval(this.selectedSeatsTimers[seat._id]);
                        delete this.selectedSeatsTimers[seat._id];

                        const index = this.requestedTickets.findIndex(t => t.seat._id === seat._id);
                        this.requestedTickets.splice(index, 1);

                        await SeatService.deselectSeat(seat._id);
                    }
                } catch (error) {
                    console.error(error);
                    this.$emit('serverError', error.response.data.err.message);
                }

                await this.updateAvailableCarsAndCurrentDisplayedCarLayout();

                this.toggleSeatsLock = false;
            },

            async updateAvailableCarsAndCurrentDisplayedCarLayout() {

                this.ride = await RideService.getRideByDetails(this.detailsFromQuery);

                this.availableCars = RideService.getCarsContainingSourceDestination(
                    this.ride,
                    this.departureStation._id,
                    this.destinationStation._id
                );

                let carLayoutWithFreeSeats = JSON.parse(JSON.stringify(
                    this.availableCars[this.currentDisplayedCarIndex].carLayout
                ));

                carLayoutWithFreeSeats = CarLayoutService.transformFromMongo2FrontendModel(carLayoutWithFreeSeats);

                if (this.$vuetify.breakpoint.smAndDown) {
                    carLayoutWithFreeSeats = CarLayoutService.rotateCarLayout(carLayoutWithFreeSeats);
                }

                const currentCar = JSON.parse(JSON.stringify(
                    this.availableCars[this.currentDisplayedCarIndex]
                ));

                currentCar.carLayout = carLayoutWithFreeSeats;

                const departureRouteStation = this.ride.routeStations.find(routeStation => {
                    return routeStation.station._id === this.departureStation._id;
                });

                const arrivalRouteStation = this.ride.routeStations.find(routeStation => {
                    return routeStation.station._id === this.destinationStation._id;
                });

                this.currentDisplayedCarLayout = CarLayoutService.fillCarLayoutWithColorfulSeats(
                    currentCar, departureRouteStation, arrivalRouteStation, this.$store.getters.getUser
                );
            },

            onChangeTickets(newTickets) {

                this.requestedTickets = JSON.parse(JSON.stringify(newTickets));

                this.requestedTickets.forEach(t => {
                    if (t.passengerType) {
                        t.price = this.kmPrice * this.distance * (1 - t.passengerType.discount / 100);
                    }
                });
            },

            onNextBookingStep() {

                this.currentStepperStep++;
            },

            onPreviousBookingStep() {

                this.currentStepperStep--;
            },

            async onPaymentCompleted() {

                let orderDetails = {
                    rideId: this.ride._id,
                    departureStationId: this.departureStation._id,
                    arrivalStationId: this.destinationStation._id,
                    tickets: []
                };

                for (let ticket of this.requestedTickets) {
                    orderDetails.tickets.push({
                        'seatId': ticket.seat._id,
                        'travelerCategoryId': ticket.passengerType._id
                    });
                }

                try {
                    this.finishedOrder = await OrderTicketService.placeOrder(orderDetails);

                    this.currentStepperStep++;

                    for (let timerId in this.selectedSeatsTimers) {
                        clearInterval(this.selectedSeatsTimers[timerId]);
                    }
                    this.selectedSeatsTimers = {};

                } catch (error) {
                    console.error(error);
                    this.$emit('serverError', error.response.data.err.message);
                }
            }
        }
    }
</script>

<style scoped>

</style>