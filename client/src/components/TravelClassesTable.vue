<template>
    <CrudTable
        entity="travel class"
        entity-name-plural="travel classes"
        sort-default-by="name"
        :headers="headers"
        :service="service"
        :default-item="defaultItem"
        :validation-rules="validationRules"
        @serverError="onServerError"
    >
        <template #form="{ editedItem }">
            <v-container>
                <v-row>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            v-model="editedItem.code"
                            label="Class Code"
                            :rules="validationRules.code"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="8">
                        <v-text-field
                            v-model="editedItem.name"
                            label="Class Name"
                            :rules="validationRules.name"
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
        name: "TravelClassesTable",
        components: {CrudTable},
        data() {
            return {
                service: CrudService.getCrudServiceForResource('travel-class'),
                headers: [
                    { text: 'Code', value: 'code', align: 'center' },
                    { text: 'Name', value: 'name', align: 'center' }
                ],
                defaultItem: {
                    id: '',
                    code: '',
                    name: ''
                },
                validationRules: {
                    'code': [
                        code => !!code || 'Code is required',
                        code => code.length < 5 || 'Code must have less than 5 characters',
                        code => !code.includes(' ') || 'Code must not contain spaces',
                        code => code === code.toUpperCase() || 'Code must contain capital letters only'
                    ],
                    'name': [
                        name => !!name || 'Name is required'
                    ]
                }
            }
        },
        methods: {
            onServerError(errorMessage) {
                this.$emit('serverError', errorMessage);
            }
        }
    }
</script>
