<template>
    <v-data-table
        :headers="tableHeaders"
        :items="items"
        :search="searchBar"
        sort-by="name"
        class="elevation-3"
        no-results-text="No car layouts have been found"
    >
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title class="headline indigo--text text-capitalize"> Car Layouts </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
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
                    color="primary"
                    icon
                    :to="{ name: 'carLayoutsForm' }"
                >
                    <v-icon>mdi-plus-circle</v-icon>
                </v-btn>
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
            service: CrudService.getCrudServiceForResource('car-layout')
        }),

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
            },

            async deleteItem (item) {

                try {
                    await this.service.delete(item._id);
                    this.items = await this.service.index();
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }
            },

            showCarLayout(carLayout) {
                this.$emit('showCarLayout', carLayout);
            }
        }
    }
</script>
