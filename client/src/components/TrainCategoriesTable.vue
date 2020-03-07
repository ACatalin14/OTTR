<template>
    <CrudTable
        entity="train category"
        entity-name-plural="train categories"
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
                            label="Category Code"
                            :rules="validationRules.code"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="8">
                        <v-text-field
                            v-model="editedItem.name"
                            label="Category Name"
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
        name: "TrainCategoriesTable",
        components: {CrudTable},
        data() {
            return {
                service: CrudService.getCrudServiceForResource('train-category'),
                headers: [
                    { text: 'Code', value: 'code', align: 'center' },
                    { text: 'Name', value: 'name', align: 'center' }
                ],
                defaultItem: {
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
