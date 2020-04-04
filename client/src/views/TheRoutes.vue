<template>
    <div>
        <GrayContainer>
            <h1 class="headline font-weight-black mb-4 pa-0">Routes Management</h1>
            <v-divider></v-divider>
            <v-row justify="space-between" class="mt-3">
                <v-col cols="12">
                    <RoutesTable
                        @serverError="onServerError"
                    ></RoutesTable>
                </v-col>
            </v-row>
        </GrayContainer>
    </div>
</template>

<script>
    import GrayContainer from "../components/GrayContainer";
    import RoutesTable from "../components/RoutesTable";

    export default {
        name: "TheRoutes",
        components: {RoutesTable, GrayContainer},
        data() {
            return {

            }
        },
        methods: {
            onServerError(errorMessage) {
                this.$emit('serverError', errorMessage);
            }
        }
    }
</script>
