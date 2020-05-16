<template>
    <div>
        <v-row no-gutters class="mb-5">
            <h2 class="display-1 font-weight-medium">
                {{ title }}
            </h2>
        </v-row>
        <v-row no-gutters>
            <v-col class="px-2">
                <v-card
                    v-for="ticket in tickets"
                    :key="ticket.seat._id"
                    class="mb-4 elevation-3"
                >
                    <v-card-text>
                        <v-row no-gutters>
                            <v-col>
                                <v-row justify="start" no-gutters>
                                    <v-col cols="auto">
                                        <h1 class="headline font-weight-bold">
                                            Car {{ carForSeatId(ticket.seat._id).number }}
                                            Seat {{ ticket.seat.number }}
                                        </h1>
                                        <h3 class="body-2 font-weight-bold">
                                            {{ carForSeatId(ticket.seat._id).travelClass.name }}
                                        </h3>
                                        <h2 class="subtitle-1 font-weight-bold">
                                            {{ ticket.passengerType.name }}
                                            {{ discountText(ticket.passengerType.discount) }}
                                        </h2>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
                            <v-col>
                                <v-row justify="end" no-gutters>
                                    <v-col cols="auto">
                                        <v-row justify="end" no-gutters>
                                            <h1 class="headline font-weight-bold">
                                                {{ ticket.price.toFixed(2) }} RON
                                            </h1>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row justify="end" no-gutters>
            <v-col cols="auto" class="ma-0 pa-0">
                <v-row justify="end" no-gutters>
                    <h1 class="headline font-weight-bold mt-2 mr-5">
                        Total: {{ totalPrice.toFixed(2) }} RON
                    </h1>
                </v-row>
            </v-col>
        </v-row>

        <v-row no-gutters class="mt-7">
            <v-btn
                color="primary"
                @click="goToPreviousBookingStep"
            >
                Previous Step
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                @click="goToNextBookingStep"
                class="text-capitalize pl-4 pr-4"
                outlined
            >
                <v-icon small class="mr-1 pt-1">mdi-open-in-new</v-icon>
                Use PayPal
            </v-btn>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: "ConfirmationBookingStep",
        props: {
            availableCars: Array,
            tickets: Array
        },
        data() {
            return {

            }
        },
        computed: {
            title() {
                return this.tickets.length === 1 ?
                    'This is your requested ticket' :
                    'These are your requested tickets';
            },

            totalPrice() {

                return this.tickets.map(t => t.price).reduce((a, b) => a + b, 0);
            }
        },
        methods: {
            goToNextBookingStep() {

                this.$emit('nextBookingStep');
            },

            goToPreviousBookingStep() {

                this.$emit('previousBookingStep');
            },

            carForSeatId(seatId) {
                return this.availableCars.find(c => {
                    const carSeatIds = c.seats.map(s => s._id);
                    return carSeatIds.includes(seatId);
                });
            },

            discountText(discount) {
                return discount ? '(' + discount + '% discount)' : '';
            }
        }
    }
</script>

<style scoped>

</style>