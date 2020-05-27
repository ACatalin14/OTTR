<template>
    <v-data-table
        :headers="tableHeaders"
        :items="items"
        :search="searchBar"
        :loading="loadingCarLayouts"
        sort-by="name"
        class="elevation-3"
        no-results-text="No car layouts have been found"
    >
        <template v-slot:top>
            <v-toolbar flat color="white" :class="tallToolbar">
                <v-row class="ma-0 pa-0">
                    <v-col class="ma-0 pa-0">
                        <v-row class="ma-0 pa-0">
                            <v-toolbar-title class="headline indigo--text text-capitalize">
                                Car Layouts
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
                                class="pl-3 pr-5 text-capitalize"
                                outlined
                                :to="{ name: 'carLayoutsForm' }"
                            >
                                <v-icon class="mr-1">mdi-draw</v-icon>
                                <strong>Create New Layout</strong>
                            </v-btn>
                            <v-btn
                                v-show="$vuetify.breakpoint.smAndDown"
                                class="mt-n2 mr-n2"
                                color="primary"
                                icon
                                :to="{ name: 'carLayoutsForm' }"
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
                @click="showCarLayout(item)"
            >
                mdi-eye
            </v-icon>
            <router-link :to="{ name: 'carLayoutsEdit', params: { carLayoutName: item.name } }">
                <v-icon
                    small
                    class="mr-2"
                    color="primary"
                >
                    mdi-pen
                </v-icon>
            </router-link>
            <v-icon
                small
                color="error"
                @click="deleteItem(item)"
            >
                mdi-delete
            </v-icon>
        </template>
        <template slot="no-data">
            <span> No car layouts available to display </span>
        </template>
    </v-data-table>
</template>

<script>
    import CrudService from '../services/crudService';

    export default {
        name: "CarLayoutsTable",

        data: () => ({
            searchBar: '',
            tableHeaders: [
                { text: 'Name', value: 'name', align: 'center' },
                { text: 'Seating Capacity', value: 'seatingCapacity', align: 'center' },
                { text: 'Width (cells)', value: 'width', align: 'center' },
                { text: 'Height (cells)', value: 'height', align: 'center' },
                { text: 'Cell Size (pixels)', value: 'cellSize', align: 'center' },
                { text: 'Actions', value: 'action', align: 'center', sortable: false }
            ],
            items: [],
            loadingCarLayouts: true,
            service: CrudService.getCrudServiceForResource('car-layout')
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
                    this.items = await this.service.index();
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                this.loadingCarLayouts = false;
            },

            async deleteItem (item) {
                
                this.loadingCarLayouts = true;

                try {
                    await this.service.delete(item._id);
                    this.items = await this.service.index();
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                this.loadingCarLayouts = false;
            },

            showCarLayout(carLayout) {
                this.$emit('showCarLayout', carLayout);
            }
        }
    }
</script>
