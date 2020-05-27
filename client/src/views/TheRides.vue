<template>
    <div>
        <GrayContainer>
            <v-row class="ma-0 pa-0 mb-3">
                <h1 class="headline font-weight-black mt-2 pa-0"> {{ routeName }}</h1>
                <v-spacer></v-spacer>
                <v-btn
                    v-if="$vuetify.breakpoint.smAndUp"
                    color="error"
                    outlined
                    class="ma-0 mr-4"
                    :to="{ name: 'routes' }"
                >
                    <strong>Back</strong>
                </v-btn>
                <v-btn
                    v-if="$vuetify.breakpoint.xsOnly"
                    color="error"
                    icon
                    :to="{ name: 'routes' }"
                >
                    <v-icon>mdi-cancel</v-icon>
                </v-btn>
            </v-row>
            <v-divider></v-divider>
            <v-row justify="space-between" class="mt-3">
                <v-col cols="12">
                    <RidesTable
                        :route="route"
                        @serverError="onServerError"
                    ></RidesTable>
                </v-col>
            </v-row>
        </GrayContainer>
    </div>
</template>

<script>
    import GrayContainer from "../components/GrayContainer";
    import RidesTable from "../components/RidesTable";
    import RouteController from '../services/routeService';
    const dateFormat = require('dateformat');

    export default {
        name: "TheRides",
        components: {RidesTable, GrayContainer},
        data() {
            return {
                route: null
            }
        },
        methods: {
            onServerError(errorMessage) {
                this.$emit('serverError', errorMessage);
            }
        },
        computed:{
            routeName() {
                if (!this.route) {
                    return 'Rides';
                }

                const routeStations = this.route.routeStations;
                const depTime = new Date(this.route.departureTime);
                const arrTime = new Date(this.route.arrivalTime);
                const n = routeStations.length - 1;

                return routeStations[0].station.name + ' (' + dateFormat(depTime, 'HH:MM') + ') - ' +
                routeStations[n].station.name + ' (' + dateFormat(arrTime, 'HH:MM') + ')';
            }
        },
        async mounted() {

            try {
                const utcName = RouteController.getUTCRouteName(this.$route.params.routeName);
                this.route = await RouteController.getByName(utcName);
            } catch (error) {
                this.$emit('serverError', error.response.data.err.message);
            }
        }
    }
</script>
