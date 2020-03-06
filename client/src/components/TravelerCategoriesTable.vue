<template>
    <CrudTable
        entity="traveler category"
        entity-name-plural="traveler categories"
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
                    <v-col cols="12" sm="7">
                        <v-text-field
                            v-model="editedItem.name"
                            label="Category Name"
                            :rules="validationRules.name"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="5">
                        <v-text-field
                            v-model="editedItem.discount"
                            label="Ticket Discount (%)"
                            :rules="validationRules.discount"
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
        name: "TravelerCategoryTable",
        components: {CrudTable},
        data() {
            return {
                service: CrudService.getCrudServiceForResource('traveler-category'),
                headers: [
                    { text: 'Name', value: 'name', align: 'center' },
                    { text: 'Ticket Discount (%)', value: 'discount', align: 'center' }
                ],
                defaultItem: {
                    id: '',
                    name: '',
                    discount: ''
                },
                validationRules: {
                    'name': [
                        name => !!name || 'Name is required'
                    ],
                    'discount': [
                        discount => !!discount || 'Discount is required',
                        discount => /^\d+$/.test(discount) || 'Discount must be a number',
                        discount => (discount >= 0 && discount <= 100) || 'Discount must be between 0 and 100',
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
