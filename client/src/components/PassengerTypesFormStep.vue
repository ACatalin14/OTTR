<template>
    <div>
        <v-row no-gutters class="mb-5">
            <h2 class="display-1 font-weight-medium">
                Choose the passenger category
            </h2>
        </v-row>
        <v-row no-gutters>
            <v-col
                v-for="car in carsWithRequestedSeats"
                :key="car._id"
                cols="12" sm="6" md="4"
            >
                <v-row>
                    <v-col>
                        <h3 class="headline font-weight-medium">
                            Car {{ car.number }} <em>({{ car.travelClass.name }})</em>
                        </h3>
                        <v-row
                            v-for="ticket in requestedTicketsOfCar(car)"
                            :key="ticket.seat._id"
                            no-gutters
                            align="center"
                        >
                            <p class="title font-weight-medium ml-5 mt-3">
                                Seat {{ ticket.seat.number }}:
                            </p>
                            <v-select
                                v-model="ticket.passengerType"
                                :items="travelerCategoriesSelectItems"
                                menu-props="auto"
                                :rules="travelerCategoryRules"
                                class="ml-3"
                                style="max-width: 100px"
                            ></v-select>
                        </v-row>
                    </v-col>
                </v-row>

            </v-col>
        </v-row>

        <v-row no-gutters class="mt-7">
            <v-btn
                v-if="$vuetify.breakpoint.smAndUp"
                color="primary"
                @click="goToPreviousBookingStep"
            >
                Previous Step
            </v-btn>
            <v-btn
                v-else
                icon
                color="primary"
                outlined
                @click="goToPreviousBookingStep"
            >
                <v-icon> mdi-chevron-left </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                v-if="$vuetify.breakpoint.smAndUp"
                color="primary"
                :disabled="!isFormValid"
                @click="goToNextBookingStep"
            >
                Next Step
            </v-btn>
            <v-btn
                v-else
                icon
                color="primary"
                outlined
                :disabled="!isFormValid"
                @click="goToNextBookingStep"
            >
                <v-icon> mdi-chevron-right </v-icon>
            </v-btn>
        </v-row>
    </div>
</template>

<script>
    import CrudService from "../services/crudService";

    export default {
        name: "PassengerTypesFormStep",
        props: {
            rideDistance: Number,
            availableCars: Array,
            tickets: Array
        },
        data() {
            return {
                selectedTickets: [],
                travelerCategories: [],
                travelerCategoriesSelectItems: [],
                travelerCategoryService: CrudService.getCrudServiceForResource('traveler-category'),
                travelerCategoryRules: [
                    id => !!id || 'Passenger category is required'
                ]
            };
        },
        computed: {
            carsWithRequestedSeats() {
                const requestedSeatsIds = this.selectedTickets.map(t => t.seat._id);

                return this.availableCars.filter(c => {

                    const seatsIdsOfCar = c.seats.map(s => s._id);

                    const requestedSeatsOfCar = seatsIdsOfCar.filter(sId => requestedSeatsIds.includes(sId));

                    return requestedSeatsOfCar.length > 0;
                });
            },

            isFormValid() {
                const selectedTravelerCategories = this.selectedTickets.map(t => t.passengerType);

                return selectedTravelerCategories && !selectedTravelerCategories.includes(null);
            }
        },
        watch: {
            selectedTickets: {
                handler(newVal) {

                    if (JSON.stringify(newVal) === JSON.stringify(this.tickets)) {
                        return;
                    }

                    this.$emit('changedTickets', newVal);
                },
                deep: true
            },

            tickets: {
                handler(newVal) {
                    this.selectedTickets = JSON.parse(JSON.stringify(newVal));
                },
                deep: true
            }
        },
        async created() {
            this.selectedTickets = JSON.parse(JSON.stringify(this.tickets));

            this.travelerCategories = await this.travelerCategoryService.index();

            this.travelerCategories.forEach( (travelCategory) => {
                this.travelerCategoriesSelectItems.push({
                    value: travelCategory,
                    text: travelCategory.name
                });
            });
        },
        methods: {
            requestedTicketsOfCar(car) {
                const carSeatsIds = car.seats.map(s => s._id);

                return this.selectedTickets.filter(t => carSeatsIds.includes(t.seat._id));
            },

            goToNextBookingStep() {

                this.$emit('nextBookingStep');
            },

            goToPreviousBookingStep() {

                this.$emit('previousBookingStep');
            }
        }
    }
</script>

<style scoped>

</style>