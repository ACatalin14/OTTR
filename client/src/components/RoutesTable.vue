<template>
    <v-data-table
        :headers="tableHeaders"
        :items="items"
        :search="searchBar"
        sort-by="name"
        class="elevation-3"
        no-results-text="No routes have been found"
    >
        <template v-slot:top>
            <v-toolbar flat color="white" :class="tallToolbar">
                <v-row class="ma-0 pa-0">
                    <v-col class="ma-0 pa-0">
                        <v-row class="ma-0 pa-0">
                            <v-toolbar-title class="headline indigo--text text-capitalize">
                                Routes
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-if="$vuetify.breakpoint.mdAndUp"
                                v-model="searchBar"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                                clearable
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <v-btn
                                v-show="$vuetify.breakpoint.mdAndUp"
                                color="primary"
                                class="pl-2 pr-5 text-capitalize"
                                outlined
                                @click="goCreateNewRoute"
                            >
                                <v-icon class="mr-1">mdi-routes</v-icon>
                                <strong>Create New Route</strong>
                            </v-btn>
                            <v-btn
                                v-show="$vuetify.breakpoint.smAndDown"
                                class="mt-n2 mr-n2"
                                color="primary"
                                icon
                                @click="goCreateNewRoute"
                            >
                                <v-icon>mdi-plus-circle</v-icon>
                            </v-btn>
                        </v-row>
                        <v-row
                            v-if="$vuetify.breakpoint.smAndDown"
                            class="ma-0 pa-0"
                        >
                            <v-text-field
                                v-model="searchBar"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                                clearable
                            ></v-text-field>
                        </v-row>
                    </v-col>
                </v-row>
            </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
            <v-icon
                small
                class="mr-2"
                color="accent"
                @click="goToRides(item)"
            >
                mdi-calendar-clock
            </v-icon>
            <v-icon
                small
                class="mr-2"
                color="primary"
                @click="goEditRoute(item)"
            >
                mdi-pen
            </v-icon>
            <v-icon
                small
                color="error"
                @click="deleteItem(item)"
            >
                mdi-delete
            </v-icon>
        </template>
        <template slot="no-data">
            <span> No routes available to display </span>
        </template>
    </v-data-table>
</template>

<script>
    import RouteService from '../services/routeService';

    export default {
        name: "RoutesTable",

        data: () => ({
            searchBar: '',
            tableHeaders: [
                { text: 'Source', value: 'frontend.depStation', align: 'left' },
                { text: 'Destination', value: 'frontend.arrStation', align: 'left' },
                { text: 'Departure', value: 'frontend.depTime', align: 'left' },
                { text: 'Arrival', value: 'frontend.arrTime', align: 'left' },
                { text: 'Train', value: 'frontend.train', align: 'left' },
                { text: 'Active Days', value: 'frontend.activeDays', align: 'left' },
                { text: 'Actions', value: 'action', align: 'center', sortable: false }
            ],
            items: [],
            service: RouteService
        }),

        computed: {
            tallToolbar() {
                return {
                    'pt-6': this.$vuetify.breakpoint.smAndDown,
                    'mb-11': this.$vuetify.breakpoint.smAndDown
                }
            }
        },

        created () {
            this.initialize();
        },

        methods: {
            async initialize () {
                try {
                    const dbItems = await this.service.index();
                    dbItems.forEach( item => {
                        this.items.push(
                            RouteService.attachFrontendFields2MongoFormat(item)
                        )
                    });
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }
            },

            async deleteItem (item) {

                try {
                    await this.service.delete(item._id);
                    this.items = [];
                    const dbItems = await this.service.index();
                    dbItems.forEach( item => {
                        this.items.push(
                            RouteService.attachFrontendFields2MongoFormat(item)
                        )
                    });
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }
            },

            async goCreateNewRoute() {

                await this.$router.push({ name: 'routesCreate' });
            },

            async goEditRoute(route) {

                await this.$router.push({
                    name: 'routesEdit',
                    params: {
                        routeName: route.frontend.name,
                        route: route
                    }
                });
            },

            async goToRides(route) {

                await this.$router.push({
                    name: 'rides',
                    params: {
                        routeName: route.frontend.name,
                        route: route
                    }
                });
            }
        }
    }
</script>
