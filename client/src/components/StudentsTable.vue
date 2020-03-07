<template>
    <CrudTable
        entity="student"
        entity-name-plural="students"
        sort-default-by="cardId"
        :headers="headers"
        :service="service"
        :default-item="defaultItem"
        :validation-rules="validationRules"
        with-search
        @serverError="onServerError"
    >
        <template #form="{ editedItem }">
            <v-container>
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="editedItem.firstName"
                            label="First Name"
                            :rules="validationRules.firstName"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="editedItem.lastName"
                            label="Last Name"
                            :rules="validationRules.lastName"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="editedItem.nin"
                            label="National Identification Number (NIN)"
                            :rules="validationRules.nin"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="editedItem.expirationDate"
                            label="Expiration Date"
                            prepend-icon="mdi-calendar"
                            :rules="validationRules.expirationDate"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </template>
    </CrudTable>
</template>

<script>
    import CrudService from '../services/crudService'
    import CrudTable from "./CrudTable";

    export default {
        name: "StudentsTable",
        components: {CrudTable},
        props: {
            defaultExpirationDate: {
                type: String,
                // required: true
            }
        },
        data() {
            return {
                service: CrudService.getCrudServiceForResource('student'),
                headers: [
                    { text: 'Card ID', value: 'cardId', align: 'center' },
                    { text: 'First Name', value: 'firstName', align: 'center' },
                    { text: 'Last Name', value: 'lastName', align: 'center' },
                    { text: 'NIN', value: 'nin', align: 'center' },
                    { text: 'Creation Date', value: 'creationDate', align: 'center' }
                ],
                defaultItem: {
                    cardId: '',
                    firstName: '',
                    lastName: '',
                    nin: '',
                    creationDate: new Date().toISOString().substr(0, 10),
                    expirationDate: this.defaultDate
                },
                validationRules: {
                    'cardId': [],
                    'firstName': [],
                    'lastName': [],
                    'nin': [],
                    'creationDate': []
                }
            }
        },
        methods: {
            onServerError(errorMessage) {
                this.$emit('serverError', errorMessage);
            }
        },
        computed: {
            defaultDate() {
                return this.defaultExpirationDate;
            }
        }
    }
</script>
