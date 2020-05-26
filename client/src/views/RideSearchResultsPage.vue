<template>
    <GrayContainer>
        <v-row class="ma-0 pa-0 mb-3">
            <v-col cols="12" md="auto" class="pt-0">
                <h1 class="heading font-weight-black mt-2 pa-0">
                    Found Rides
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

        <v-row v-if="ridesNotFound">
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <v-row justify="center">
                            Uh Oh...
                        </v-row>
                    </v-card-title>
                    <v-card-subtitle class="pt-2 pb-5">
                        <v-row justify="center">
                            No rides were found in order to match the given criteria. <br/>
                            Try searching for another date or give up any optional filters.
                        </v-row>
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>

        <RideCardSearchResult
            v-for="ride in rides"
            :key="ride._id"
            :ride="ride"
            :departure-station="departureStation"
            :arrival-station="destinationStation"
            :via-station="viaStation"
            :tavel-class="travelClass"
        ></RideCardSearchResult>

    </GrayContainer>
</template>

<script>
    import RideService from "../services/rideService";
    import StationService from "../services/stationService";
    import TravelClassService from "../services/travelClassService";
    import GrayContainer from "../components/GrayContainer";
    import RideCardSearchResult from "../components/RideCardSearchResult";
    const queryString = require('query-string');
    const dateFormat = require('dateformat');

    export default {
        name: "RideSearchResultsPage",
        components: {RideCardSearchResult, GrayContainer},
        data() {
            return {
                rides: [],
                ridesNotFound: false,
                departureStation: null,
                destinationStation: null,
                rideDateString: "",
                viaStation: null,
                travelClass: null
            }
        },

        computed: {
            pageTitle() {
                if (!this.departureStation || !this.destinationStation || !this.rideDateString) {
                    return '';
                }

                let title = '';
                title += '<em style="color: darkblue">' + this.departureStation.name +
                    '</em> <i class="fa fa-long-arrow-right"></i> <em style="color: darkblue">' +
                    this.destinationStation.name + '</em>';
                if (this.$vuetify.breakpoint.mdOnly || this.$vuetify.breakpoint.xsOnly) {
                    title += '<br/>';
                } else {
                    title += this.viaStation || this.travelClass ? ', ' : '';
                }
                title += this.viaStation ? 'via <em style="color: darkblue">' + this.viaStation.name + '</em> ' : '';
                title += this.travelClass ? '<em>(' + this.travelClass.name + ')</em>' : '';

                return title;
            }
        },

        async created() {
            try {

                let queryFilters = queryString.parse('?' + this.$route.params.filters);

                if ([queryFilters.from, queryFilters.to, queryFilters.date].includes(undefined)) {

                    await this.$router.push({ name: 'pageNotFound', params: {}});
                }

                this.departureStation = await StationService.getStationByCode(queryFilters.from);
                this.destinationStation = await StationService.getStationByCode(queryFilters.to);
                this.rideDateString = dateFormat(new Date(queryFilters.date), 'dd mmmm yyyy');
                this.viaStation = queryFilters.via ? await StationService.getStationByCode(queryFilters.via) : null;
                this.travelClass = queryFilters.class ?
                    await TravelClassService.getTravelClassByCode(queryFilters.class) :
                    null;

                const today =  new Date();
                const requestedDate = new Date(queryFilters.date);

                // check if requested date is today
                if (today.getDate() === requestedDate.getDate() &&
                    today.getMonth() === requestedDate.getMonth() &&
                    today.getFullYear() === requestedDate.getFullYear()
                ) {
                    requestedDate.setHours(today.getHours(), today.getMinutes(), today.getSeconds(), 0);
                }

                const filters = {
                    sourceId: this.departureStation._id,
                    destinationId: this.destinationStation._id,
                    date: requestedDate.getTime(),
                    viaStationId: this.viaStation ? this.viaStation._id : null,
                    travelClassId: this.travelClass ? this.travelClass._id : null
                };

                this.rides = await RideService.getFilteredRides(filters);

                this.ridesNotFound = (this.rides.length === 0);

            } catch (error) {

                this.ridesNotFound = true;
                this.$emit('serverError', error.response.data.err.message);
            }
        }
    }
</script>

<style scoped>

</style>