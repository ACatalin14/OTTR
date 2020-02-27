<template>
    <v-data-table
        :headers="headers"
        :items="stations"
        sort-by="name"
        class="elevation-3"
        :search="searchBar"
    >
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title class="headline indigo--text">Stations</v-toolbar-title>
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
                <v-dialog v-model="formDialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-icon color="primary" v-on="on" >mdi-plus-circle</v-icon>
                    </template>
                    <v-card v-if="formDialog">
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-container class="pb-0">
                                <v-row>
                                    <v-col cols="12" sm="4">
                                        <v-text-field v-model="editedItem.code" label="Station code" :rules="stationCodeRules"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="8">
                                        <v-text-field v-model="editedItem.name" label="Station name" :rules="stationNameRules"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions class="pt-0">
                            <v-spacer></v-spacer>
                            <v-btn color="error" text @click="close">Cancel</v-btn>
                            <v-btn color="primary" text @click="save">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
            <v-icon
                small
                class="mr-2"
                color="primary"
                @click="editItem(item)"
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
        <template v-slot:no-data>
            <span>No stations available to display</span>
        </template>
    </v-data-table>
</template>

<script>
    import StationService from '../services/stationService'

    export default {
        name: "StationsTable",
        data: () => ({
            formDialog: false,
            searchBar: '',
            headers: [
                { text: 'Code', value: 'code' },
                { text: 'Name', value: 'name', align: 'center' },
                { text: 'Actions', value: 'action', align: 'right', sortable: false }
            ],
            stations: [],
            editingItem: false,
            editedItem: {
                id: '',
                code: '',
                name: ''
            },
            defaultItem: {
                id: '',
                code: '',
                name: ''
            },
            stationCodeRules: [
                code => !!code || 'Code is required',
                code => code.length <= 4 || 'Code must have less than 4 characters',
                code => !code.includes(' ') || 'Code must not contain spaces',
                code => code === code.toUpperCase() || 'Code must contain capital letters only'
            ],
            stationNameRules: [
                name => !!name || 'Name is required'
            ]
        }),

        computed: {
            formTitle () {
                return !this.editingItem ? 'New Station' : 'Edit Station'
            },
        },

        watch: {
            dialog (val) {
                val || this.close()
            },
        },

        created () {
            this.initialize()
        },

        methods: {
            async initialize () {
                try {
                    this.stations = await StationService.index();
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }
            },

            editItem (item) {
                this.editedItem = Object.assign({}, item);
                this.editingItem = true;
                this.formDialog = true
            },

            async deleteItem (item) {

                try {
                    await StationService.delete(item._id);
                    this.stations = await StationService.index();
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }
            },

            close () {
                this.formDialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editingItem = false;
                }, 300);
            },

            async save () {
                try {
                    if (this.editingItem) {
                        await StationService.update(this.editedItem);
                    } else {
                        await StationService.create(this.editedItem);
                    }

                    this.stations = await StationService.index();
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                this.close();
            },
        }
    }
</script>
