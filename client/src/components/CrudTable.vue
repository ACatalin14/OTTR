<template>
    <v-data-table
        :headers="tableHeaders"
        :items="items"
        :sort-by="sortDefaultBy"
        :search="searchBar"
        class="elevation-3"
    >
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title class="headline indigo--text text-capitalize"> {{ entityNamePlural }}</v-toolbar-title>
                <v-spacer v-if="withSearch"></v-spacer>
                <v-text-field
                    v-if="withSearch"
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
                        <v-form
                            v-model="itemFormValid"
                            ref="itemForm"
                            lazy-validation
                            @submit.prevent="save"
                        >
                            <v-card-title>
                                <span class="headline text-capitalize">{{ formTitle }}</span>
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text class="py-0">

                                <slot
                                    name="form"
                                    :editedItem="editedItem"
                                    class="pb-0"
                                ></slot>

                            </v-card-text>
                            <v-card-actions class="pt-0">
                                <v-spacer></v-spacer>
                                <v-btn color="error" text @click="close">Cancel</v-btn>
                                <v-btn color="primary" text :disabled="!itemFormValid" type="submit">Save</v-btn>
                            </v-card-actions>
                        </v-form>
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
            <span> No {{ entityNamePlural.toLowerCase() }} available to display </span>
        </template>
    </v-data-table>
</template>

<script>
    export default {
        name: "CrudTable",

        props: {
            entity: String,
            entityNamePlural: String,
            headers: Array,
            sortDefaultBy: String,
            validationRules: Object,
            defaultItem: Object,
            withSearch: {
                type: Boolean,
                required: false,
                default: false
            },
            service: {
                type: Object,
                required: true
            }
        },

        data: () => ({
            formDialog: false,
            itemFormValid: true,
            searchBar: '',
            tableHeaders: [
                { text: 'Actions', value: 'action', align: 'center', sortable: false }
            ],
            items: [],
            editingItem: false,
            editedItem: { }
        }),

        computed: {
            formTitle () {
                const capitalizedName = this.entity[0].toUpperCase() + this.entity.slice(1);
                return !this.editingItem ? 'New ' + capitalizedName : 'Edit ' + capitalizedName;
            },
        },

        watch: {
            dialog (val) {
                val || this.close()
            },
        },

        created () {
            this.initialize();
            this.tableHeaders = this.headers.concat(this.tableHeaders);
            this.editedItem = Object.assign({}, this.defaultItem);
        },

        methods: {
            async initialize () {
                try {
                    this.items = await this.service.index();
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
                    await this.service.delete(item._id);
                    this.items = await this.service.index();
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
                    if (!this.$refs.itemForm.validate()) {
                        this.itemFormValid = false;
                        return;
                    }

                    if (this.editingItem) {
                        await this.service.update(this.editedItem);
                    } else {
                        await this.service.create(this.editedItem);
                    }

                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                try {
                    this.items = await this.service.index();
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                this.close();
            },
        }
    }
</script>
