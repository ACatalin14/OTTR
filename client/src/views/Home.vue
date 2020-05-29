<template>
    <div class="home">
        <v-carousel
            :show-arrows="false"
            :hide-delimiters="true"
            cycle
            :interval="8000"
            vertical
            height="200"
            class="carousel"
        >
            <v-carousel-item
                v-for="(item,i) in carouselItems"
                :key="i"
                :src="require('@/assets/' + item.path)"
                height="100%"
                class="carousel-item"
            >
                <v-row
                    style="width: 100%; height: 100%;"
                    class="carousel-item ma-0 pa-0"
                    align="center"
                    justify="center"
                >
                    <v-col class="text-center">
                        <h1 v-if="$vuetify.breakpoint.smAndUp" class="primary--text carousel-heading">
                            Book Your Ride
                        </h1>
                        <h1 v-else class="primary--text carousel-heading-xs">
                            Book Your Ride
                        </h1>
                        <p class="title primary--text font-italic font-weight-bold text--lighten-1">
                            Safe, Secure, Fast.
                            <br>There is no easier way to book your train ride other than OTTR.
                        </p>
                    </v-col>
                </v-row>
            </v-carousel-item>
        </v-carousel>
        <v-row class="px-5 mt-10 mb-5 mx-0">
            <v-col cols="12" md="6">
                <v-card max-width="450" style="border-top: solid 4px indigo; margin: auto" elevation="5">
                    <v-form
                        v-model="searchRidesFormValid"
                        ref="searchRidesForm"
                        lazy-validation
                        @submit.prevent="searchRides"
                    >
                        <v-card-title class="justify-center">
                            <h3>Search for rides</h3>
                        </v-card-title>
                        <v-card-text class="px-7">
                            <v-row class="justify-center align-center">
                                <v-col cols="1" class="ma-0 pa-0">
                                    <v-btn color="primary" icon @click="swapFromToStations">
                                        <v-icon>mdi-swap-vertical</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col>
                                    <v-autocomplete
                                        v-model="fromStation"
                                        :items="stations"
                                        :search-input.sync="fromStationSearch"
                                        hide-no-data
                                        hide-selected
                                        item-text="name"
                                        item-value="_id"
                                        label="From"
                                        placeholder="Source Station"
                                        prepend-icon="mdi-city"
                                        return-object
                                        :rules="validationRules.fromStation"
                                    >
                                    </v-autocomplete>
                                    <v-autocomplete
                                        v-model="toStation"
                                        :items="stations"
                                        :search-input.sync="toStationSearch"
                                        hide-no-data
                                        hide-selected
                                        item-text="name"
                                        item-value="_id"
                                        label="To"
                                        placeholder="Destination Station"
                                        prepend-icon="mdi-city"
                                        return-object
                                        :rules="validationRules.toStation"
                                    >
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                            <v-autocomplete
                                v-model="viaStation"
                                :items="stations"
                                :search-input.sync="viaStationSearch"
                                hide-no-data
                                hide-selected
                                item-text="name"
                                item-value="_id"
                                label="Via"
                                placeholder="Optional"
                                prepend-icon="mdi-city"
                                return-object
                            >
                            </v-autocomplete>
                            <DatePicker
                                name="rideDateSearch"
                                label="Departure Date"
                                :initial-value="new Date().toISOString().substr(0, 10)"
                                :classes="'mt-3'"
                                prepend-icon="mdi-calendar"
                                :inline-style="'width: 400px;'"
                                :min-date="new Date().toISOString().substr(0, 10)"
                                @datePickerChanged="onDatePickerChanged($event)"
                            >
                            </DatePicker>
                            <v-autocomplete
                                v-model="selectedTravelClass"
                                :items="travelClasses"
                                :search-input.sync="travelClassSearch"
                                hide-no-data
                                hide-selected
                                item-text="name"
                                item-value="_id"
                                label="Travel Class"
                                placeholder="Any"
                                prepend-icon="mdi-seat-passenger"
                                return-object
                            >
                            </v-autocomplete>
                        </v-card-text>
                        <v-card-actions class="pb-5 px-7">
                            <v-btn
                                color="primary"
                                width="100%"
                                :disabled="!searchRidesFormValid"
                                type="submit"
                            >
                                <v-icon class="mr-2">mdi-magnify</v-icon>
                                Search
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <AdvertisementCarousel></AdvertisementCarousel>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    // @ is an alias to /src
    // import HelloWorld from '@/components/HelloWorld.vue'
    import CrudService from '../services/crudService';
    import DatePicker from "../components/DatePicker";
    import AdvertisementCarousel from "../components/AdvertisementCarousel";

    export default {
        name: 'home',
        components: {
            AdvertisementCarousel,
            DatePicker

        },
        data() {
            return {
                stations: [],
                travelClasses: [],
                searchRidesFormValid: true,
                fromStation: null,
                toStation: null,
                viaStation: null,
                selectedTravelClass: null,
                fromStationSearch: null,
                toStationSearch: null,
                viaStationSearch: null,
                travelClassSearch: null,
                rideDateString: new Date().toISOString().substr(0, 10),
                stationService: CrudService.getCrudServiceForResource('station'),
                travelClassService: CrudService.getCrudServiceForResource('travel-class'),
                carouselItems: [
                    { path: 'carousel-img-1.png' },
                    { path: 'carousel-img-2.png' },
                    { path: 'carousel-img-3.png' },
                    { path: 'carousel-img-4.png' },
                    { path: 'carousel-img-5.png' },
                ],
                validationRules: {
                    'fromStation': [
                        st => !!st || 'Departure station is required'
                    ],
                    'toStation': [
                        st => !!st || 'Destination station is required'
                    ]
                }
            }
        },
        async created() {

            try {
                this.stations = await this.stationService.index();
                this.travelClasses = await this.travelClassService.index();
            } catch (error) {
                this.$emit('serverError', error.response.data.err.message);
            }
        },
        methods: {
            swapFromToStations() {
                [this.fromStation, this.toStation] = [this.toStation, this.fromStation];
                [this.fromStationSearch, this.toStationSearch] = [this.toStationSearch, this.fromStationSearch];
            },

            onDatePickerChanged(event) {

                if (event.name === 'rideDateSearch') {
                    this.rideDateString = event.newDate;
                }
            },

            async searchRides() {

                try {
                    if (!this.$refs.searchRidesForm.validate()) {
                        this.searchRidesFormValid = false;
                        return;
                    }

                    let filtersUrlQuery = 'from=' + this.fromStation.code +
                        '&to=' + this.toStation.code +
                        '&date=' + this.rideDateString;
                    filtersUrlQuery += this.viaStation ? '&via=' + this.viaStation.code : '';
                    filtersUrlQuery += this.selectedTravelClass ? '&class=' + this.selectedTravelClass.code : '';

                    await this.$router.push({ name: 'rideSearchResults', params: { filters: filtersUrlQuery }});
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }
            }
        }
    }
</script>

<style scoped>
    .home {
        height: 100%;
        background-image: repeating-linear-gradient(35deg, #E9E9E9, #FFF, #E9E9E9 20%);
    }
    .carousel-item {
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(100, 100, 255, 0.8));
    }
    .carousel {
        box-shadow: 0 5px 10px rgba(50, 50, 221, 1)
    }
    .carousel-heading {
        font-family: "Patua One", "Roboto", serif;
        font-size: 50px;
    }
    .carousel-heading-xs {
        font-family: "Patua One", "Roboto", serif;
        font-size: 38px;
    }
</style>