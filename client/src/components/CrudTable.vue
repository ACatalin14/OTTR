<template>
    <v-data-table
        :headers="tableHeaders"
        :items="items"
        :sort-by="sortDefaultBy"
        :search="searchBar"
        :no-results-text="'No ' + entityNamePlural + ' have been found'"
        :items-per-page="itemsPerPage"
        :loading="loadingItems"
        class="elevation-3"
    >
        <template v-slot:top>
            <v-toolbar flat color="white" :class="tallToolbar">
                <v-row class="ma-0 pa-0">
                    <v-col class="ma-0 pa-0">
                        <v-row class="ma-0 pa-0">
                            <v-toolbar-title class="headline indigo--text text-capitalize"> {{ entityNamePlural }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-if="withSearch && $vuetify.breakpoint.mdAndUp"
                                v-model="searchBar"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                                clearable
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="formDialog" max-width="500px" persistent>
                                <template v-slot:activator="{ on }">
                                    <v-icon color="primary" v-on="on" >mdi-plus-circle</v-icon>
                                </template>
                                <v-card v-if="formDialog" :loading="savingItem">
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
                                            <v-btn
                                                text
                                                type="submit"
                                                color="primary"
                                                :disabled="!itemFormValid || savingItem"
                                            >
                                                Save
                                            </v-btn>
                                        </v-card-actions>
                                    </v-form>
                                </v-card>
                            </v-dialog>
                        </v-row>
                        <v-row
                            v-if="withSearchSmallScreen"
                            class="ma-0 pa-0 mt-3"
                        >
                            <v-text-field
                                v-model="searchBar"
                                append-icon="mdi-magnify"
                                class="ma-0 pa-0"
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
                v-show="withChangeOrder"
                small
                class="mr-1"
                :color="changeOrderColor"
                @click="moveUpItem(item)"
            >
                mdi-menu-up-outline
            </v-icon>
            <v-icon
                v-show="withChangeOrder"
                small
                class="mr-2"
                :color="changeOrderColor"
                @click="moveDownItem(item)"
            >
                mdi-menu-down-outline
            </v-icon>
            <v-icon
                v-show="withShowItem"
                small
                class="mr-2"
                color="accent"
                @click="showItem(item)"
            >
                mdi-eye
            </v-icon>
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
            },
            withChangeOrder: {
                type: Boolean,
                default: false
            },
            changeOrderColor: {
                type: String,
                default: 'accent'
            },
            disableSort: {
                type: Boolean,
                default: false
            },
            withShowItem: {
                type: Boolean,
                default: false
            },
            itemsPerPage: {
                type: Number,
                default: 10
            }
        },

        data: () => ({
            formDialog: false,
            itemFormValid: true,
            searchBar: '',
            savingItem: false,
            loadingItems: true,
            tableHeaders: [
                { text: 'Actions', value: 'action', align: 'center', sortable: false }
            ],
            items: [],
            editingItem: false,
            editedItem: { }
        }),

        computed: {
            formTitle() {
                const capitalizedName = this.entity[0].toUpperCase() + this.entity.slice(1);
                return !this.editingItem ? 'New ' + capitalizedName : 'Edit ' + capitalizedName;
            },

            withSearchSmallScreen() {
                return this.withSearch && this.$vuetify.breakpoint.smAndDown;
            },

            tallToolbar() {
                return {
                    'pt-6': this.withSearchSmallScreen,
                    'mb-12': this.withSearchSmallScreen
                }
            }
        },

        watch: {
            dialog (val) {
                val || this.close()
            },
        },

        created() {
            this.initialize();
            this.tableHeaders = this.headers.concat(this.tableHeaders);
            this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
        },

        methods: {
            async initialize() {
                try {
                    this.items = JSON.parse(JSON.stringify(
                        await this.service.index()
                    ));
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }
                this.loadingItems = false;
            },

            editItem(item) {
                this.editedItem = JSON.parse(JSON.stringify(item));
                this.editingItem = true;
                this.formDialog = true;
                this.$emit('clickedEditItem', item);
            },

            async deleteItem(item) {
                this.loadingItems = true;

                try {
                    await this.service.delete(item._id);
                    this.items = JSON.parse(JSON.stringify(
                        await this.service.index()
                    ));
                    this.$emit('deletedItem', item);
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                this.loadingItems = false;
            },

            close() {
                this.formDialog = false;
                setTimeout(() => {
                    this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
                    this.editingItem = false;
                }, 300);
                this.$emit('closedForm');
            },

            async save() {
                try {
                    if (!this.$refs.itemForm.validate()) {
                        this.itemFormValid = false;
                        return;
                    }

                    this.savingItem = true;

                    if (this.editingItem) {
                        await this.service.update(this.editedItem);
                        this.$emit('updatedItem', this.editedItem);
                    } else {
                        await this.service.create(this.editedItem);
                        this.$emit('createdItem', this.editedItem);
                    }

                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                try {
                    this.loadingItems = true;
                    this.items = JSON.parse(JSON.stringify(
                        await this.service.index()
                    ));
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                this.loadingItems = false;
                this.savingItem = false;
                this.close();
            },

            moveUpItem(item) {

                const index = this.items.indexOf(item);

                if (index < 1) {
                    // do not move up first element of array (0)
                    return;
                }

                this.items = this.service.moveUp(index);

                this.$emit('movedUpItem', index);
            },

            moveDownItem(item) {

                const index = this.items.indexOf(item);

                if (index === -1 || index === this.items.length - 1) {
                    // do not move down last element of array (n)
                    return;
                }

                this.items = this.service.moveDown(index);

                this.$emit('movedDownItem', index);
            },

            showItem(item) {

                this.$emit('showItem', item);
            }
        }
    }
</script>
