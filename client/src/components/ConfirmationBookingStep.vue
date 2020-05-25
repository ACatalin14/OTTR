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
                    <v-card-text
                        v-if="ticket.seat && ticket.passengerType"
                    >
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
                                                {{ ticket.price.toFixed(2) }} USD
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
                        Total: {{ totalPrice.toFixed(2) }} USD
                    </h1>
                </v-row>
            </v-col>
        </v-row>

        <v-row no-gutters class="mt-7" align="center">
            <v-btn
                color="primary"
                @click="goToPreviousBookingStep"
            >
                Previous Step
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                v-if="totalPrice === 0"
                color="primary"
                @click="onPaymentCompleted"
                class="text-capitalize pl-4 pr-4"
                outlined
            >
                <v-icon small class="mr-2 pt-0">mdi-send</v-icon>
                Finish Order
            </v-btn>
            <PayPal
                v-if="totalPrice > 0"
                :amount="totalPrice.toFixed(2)"
                :items="paypalItems"
                currency="USD"
                :client="paypalProps.paypalCredentials"
                env="sandbox"
                :button-style="paypalProps.paypalButtonStyle"
                style="width: 200px;"
                @payment-completed="onPaymentCompleted"
                @payment-cancelled="onPaymentCancelled"
            >
            </PayPal>
        </v-row>
    </div>
</template>

<script>
    import PayPal from "vue-paypal-checkout";

    export default {
        name: "ConfirmationBookingStep",
        components: {
            PayPal
        },
        props: {
            paypalProps: Object,
            availableCars: Array,
            ride: Object,
            departureStation: Object,
            destinationStation: Object,
            departureTimeText: String,
            arrivalTimeText: String,
            rideDate: String,

            // Array of objects: {seat: {MongoDb ObjectScheme}, car: {Mongo ObjectScheme}, passengerType: {Obj}, price: 200}
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
            },

            paypalItems() {
                const description = 'Tickets for ride: ' + this.departureStation.name + ' (' + this.departureTimeText +
                    ') - ' + this.destinationStation.name + ' (' + this.arrivalTimeText + ') with departure on ' +
                    this.rideDate;

                return [{
                    name: 'OTTR Order',
                    description: description,
                    quantity: '1',
                    price: this.totalPrice,
                    currency: 'USD'
                }];
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
                const car = this.availableCars.find(c => {
                    const carSeatIds = c.seats.map(s => s._id);
                    return carSeatIds.includes(seatId);
                });

                return car ? car : null;
            },

            discountText(discount) {
                return discount ? '(' + discount + '% discount)' : '';
            },

            // TODO: If ever wishing to enter production mode, remove env="sandbox" attribute of <PayPal> component
            onPaymentCompleted(obj) {
                console.log('Payment Completed.');
                this.$emit('paymentCompleted');
            },

            onPaymentCancelled(obj) {
                console.log('Payment Canceled.');
            }
        }
    }
</script>

<style scoped>

</style>