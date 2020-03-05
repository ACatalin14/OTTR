<template>
    <v-container fluid class="ma-0 px-7 pt-7 pb-1 ">
<!-- TODO: tabel pt passenger types (3 col), studenti (6 col), train types (2/3 col), class types -->
        <v-row id="miscellaneous-container" class="ma-0 pa-0">
            <v-col class="pa-6 pt-5">
                <h1 class="headline font-weight-black mb-4 pa-0">Miscellaneous</h1>
                <v-divider></v-divider>
                <v-row justify="space-between" class="mt-3">
                    <v-col cols="12" md="6" lg="5">
                        <StationsTable @serverError="onServerError"></StationsTable>
                    </v-col>
                    <v-divider vertical class="my-5"></v-divider>
                    <v-col cols="12" md="6" lg="5">

                    </v-col>
                </v-row>
                <v-row>

                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import StationsTable from "../components/StationsTable";
    export default {
        name: "TheMiscellaneous",
        components: {StationsTable},
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

<style>
    #miscellaneous-container {
        background-color: #F5F5F5;
    }
</style>