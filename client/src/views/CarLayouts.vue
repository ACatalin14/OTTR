<template>
    <GrayContainer>
        <h1 class="headline font-weight-black mb-4 pa-0">Car Layouts Management</h1>
        <v-divider></v-divider>
        <v-row justify="space-between" class="mt-3">
            <v-col cols="12">
                <CarLayoutsTable
                    @serverError="onServerError"
                ></CarLayoutsTable>
            </v-col>
        </v-row>
    </GrayContainer>
</template>

<script>
    import CarLayoutsTable from "../components/CarLayoutsTable";
    import GrayContainer from "../components/GrayContainer";
    export default {
        name: "CarLayouts",
        components: {GrayContainer, CarLayoutsTable},
        methods: {
            onServerError(errorMessage) {
                this.$emit('serverError', errorMessage);
            }
        }
    }
</script>
