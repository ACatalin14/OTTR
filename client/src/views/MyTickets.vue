<template>
    <GrayContainer>
        <h1 class="headline font-weight-black mb-4 pa-0">My Tickets</h1>
        <v-divider></v-divider>
        <v-progress-linear
            v-if="loadingOrders"
            indeterminate
            color="primary"
            height="4"
        ></v-progress-linear>
        <v-row v-if="!myOrders.length && !loadingOrders">
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <v-row justify="center">
                            No Tickets Found...
                        </v-row>
                    </v-card-title>
                    <v-card-subtitle class="pt-2 pb-5">
                        <v-row justify="center">
                            Looks like you haven't placed any order so far. <br/>
                            You can book your seat anytime from the Home page!
                        </v-row>
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else justify="space-between" class="mt-3">
            <v-col cols="12">
                <v-card
                    v-for="order in myOrders"
                    :key="order.number"
                    class="mb-4 elevation-3"
                >
                    <v-card-title class="py-2">
                        <h2 class="title font-weight-bold">Order #{{order.number}}</h2>
                        <v-spacer></v-spacer>
                        <h2 class="title font-weight-bold">{{order.price.toFixed(2)}} USD</h2>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="mb-0 pb-0">
                        <v-row no-gutters>
                            <v-col cols="12" md="4">
                                <v-row v-if="$vuetify.breakpoint.mdAndUp" justify="start" no-gutters >
                                    <v-col cols="auto">
                                        <h3 class="subtitle-2 font-weight-bold"> Departure </h3>
                                        <h1 class="display-1 font-weight-bold"> {{ order.departureStation }} </h1>
                                        <h2 class="title font-weight-bold">{{ order.departureDateText }} </h2>
                                    </v-col>
                                </v-row>
                                <v-row v-else justify="start" no-gutters>
                                    <v-col>
                                        <h3 class="subtitle-2 font-weight-bold"> Departure </h3>
                                        <h2 class="title font-weight-bold"> {{ order.departureStation }} - {{
                                            order.departureDateText }} </h2>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-row v-if="$vuetify.breakpoint.mdAndUp" justify="center" no-gutters>
                                    <v-col cols="auto">
                                        <v-row justify="center" no-gutters>
                                            <h1 class="headline font-weight-bold">Train {{ order.trainName }} </h1>
                                        </v-row>
                                        <v-row justify="center" no-gutters>
                                            <h1 class="title font-weight-bold">
                                                {{ order.distance }} Km, {{ order.spentTime }}
                                            </h1>
                                        </v-row>
                                        <v-spacer></v-spacer>
                                        <v-row justify="center" no-gutters>
                                            <v-btn
                                                icon
                                                @click="toggleVisibilityTicketsForOrder(order)"
                                                color="accent"
                                            >
                                                <v-icon>{{ order.showTickets ? 'mdi-chevron-up' :
                                                    'mdi-chevron-down' }}</v-icon>
                                            </v-btn>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row v-else justify="start" no-gutters>
                                    <v-col>
                                        <h3 class="subtitle-2 font-weight-bold"> Arrival </h3>
                                        <h2 class="title font-weight-bold"> {{ order.arrivalStation }} - {{
                                            order.arrivalDateText }} </h2>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-row v-if="$vuetify.breakpoint.mdAndUp" justify="end" no-gutters>
                                    <v-col cols="auto">
                                        <v-row justify="end" no-gutters>
                                            <h3 class="subtitle-2 font-weight-bold"> Arrival </h3>
                                        </v-row>
                                        <v-row justify="end" no-gutters>
                                            <h1 class="display-1 font-weight-bold"> {{ order.arrivalStation }} </h1>
                                        </v-row>
                                        <v-row justify="end" no-gutters>
                                            <h2 class="title font-weight-bold">{{ order.arrivalDateText }}</h2>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row v-else justify="start" no-gutters>
                                    <v-col>
                                        <h3 class="subtitle-2 font-weight-bold"> Ride Details </h3>
                                        <v-row no-gutters>
                                            <h2 class="title font-weight-bold"> Train {{ order.trainName }} </h2>
                                            <v-spacer></v-spacer>
                                            <h2 class="title font-weight-bold"> {{ order.distance }} Km, {{ order.spentTime }}</h2>
                                        </v-row>
                                        <v-row justify="center" no-gutters>
                                            <v-btn
                                                icon
                                                @click="toggleVisibilityTicketsForOrder(order)"
                                                color="accent"
                                            >
                                                <v-icon>{{ order.showTickets ? 'mdi-chevron-up' :
                                                    'mdi-chevron-down' }}</v-icon>
                                            </v-btn>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-expand-transition>
                            <div v-show="order.showTickets">
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-row>
                                        <v-col
                                            cols="12" sm="6" md="4" lg="3"
                                            v-for="ticket of order.tickets"
                                            :key="ticket._id"
                                        >
                                            <v-card elevation="3" color="#F4F4F4" style="border-left: 3px solid orange">
                                                <v-card-title class="pb-2">
                                                    <h1 class="headline font-weight-bold">
                                                        Car {{ticket.car.number}} - Seat {{ticket.seat.number}}
                                                    </h1>
                                                </v-card-title>
                                                <v-card-text>
                                                    <v-row no-gutters>
                                                        <v-col>
                                                            <h2 class="title font-weight-bold">
                                                                {{ ticket.passengerType.name }}
                                                            </h2>
                                                            <h3 class="subtitle-1 font-weight-bold">
                                                                {{ ticket.car.travelClass.name }}
                                                            </h3>
                                                        </v-col>
                                                        <v-col>
                                                            <v-row justify="end" no-gutters class="fill-height"
                                                                   align="center">
                                                                <h2 class="title font-weight-bold">
                                                                    {{ ticket.price.toFixed(2) }} USD
                                                                </h2>
                                                            </v-row>

                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </div>
                        </v-expand-transition>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </GrayContainer>
</template>

<script>
    import GrayContainer from "../components/GrayContainer";
    import orderTicketService from "../services/orderTicketService";
    const dateFormat = require('dateformat');

    export default {
        name: "MyTickets",
        components: {GrayContainer},
        data() {
            return {
                myOrders: [],
                loadingOrders: true
            }
        },
        async created() {

            this.myOrders = await orderTicketService.getOrdersForUser(this.$store.getters.getUser._id);
            let orders = [];
            this.myOrders.forEach(order => orders.push(order));

            orders.forEach(order => {
                order.showTickets = false;

                order.departureStation = order.tickets[0].departureStation.station.name;
                order.arrivalStation = order.tickets[0].arrivalStation.station.name;

                const indexDep = order.tickets[0].departureStation.orderNo - 1;
                const indexArr = order.tickets[0].arrivalStation.orderNo - 1;
                order.departureDateText = dateFormat(order.tickets[0].ride.departureDates[indexDep], 'dd mmmm yyyy (HH:MM)');
                order.arrivalDateText = dateFormat(order.tickets[0].ride.arrivalDates[indexArr], 'dd mmmm yyyy (HH:MM)');

                order.distance = order.tickets[0].arrivalStation.distance - order.tickets[0].departureStation.distance;

                const depDateFromMySource = new Date(order.tickets[0].ride.departureDates[indexDep]);
                const arrDateToMyDestination = new Date(order.tickets[0].ride.arrivalDates[indexArr]);
                const spentTimeMs = arrDateToMyDestination - depDateFromMySource;
                const hours = Number.parseInt(spentTimeMs / 1000 / 60 / 60);
                const minutes = Number.parseInt(spentTimeMs / 1000 / 60);

                order.spentTime = hours > 0 && (minutes % 60) > 0 ? hours + ' h ' + (minutes % 60) + ' min' :
                    hours > 0 && !(minutes % 60) ? hours + ' h' :
                        !hours && (minutes % 60) > 0 ? (minutes % 60) + ' min' : 'IMMEDIATELY';

                order.trainName = order.tickets[0].train.trainCategory.code + '-' + order.tickets[0].train.number;
            });

            // sort in descendent order by id
            orders.sort((a, b) => b.number - a.number);

            this.myOrders.splice(0, this.myOrders.length, ...orders);

            this.loadingOrders = false;
        },
        methods: {
            toggleVisibilityTicketsForOrder(order) {
                const index = this.myOrders.findIndex(o => o.number === order.number);

                if (order.showTickets) {
                    order.showTickets = false;
                    this.myOrders.splice(index, 1, order);
                    return;
                }

                let orders = [];
                this.myOrders.forEach(order => orders.push(order));
                orders.forEach(order => order.showTickets = false);
                this.myOrders.splice(0, this.myOrders.length, ...orders);

                order.showTickets = true;
                this.myOrders.splice(index, 1, order);
            }
        }
    }
</script>

<style scoped>

</style>