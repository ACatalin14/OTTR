<template>
    <GrayContainer>
        <CarLayoutDialog
            :state="printedCarLayoutDialog"
            :car-layout="printedCarLayout"
            @changeDialogState="onChangeDialogState"
        >
        </CarLayoutDialog>
        <h1 class="headline font-weight-black mb-4 pa-0">Car Layouts Management</h1>
        <v-divider></v-divider>
        <v-row justify="space-between" class="mt-3">
            <v-col cols="12">
                <CarLayoutsTable
                    @serverError="onServerError"
                    @showCarLayout="onShowCarLayout"
                ></CarLayoutsTable>
            </v-col>
        </v-row>
    </GrayContainer>
</template>

<script>
    import GrayContainer from "../components/GrayContainer";
    import CarLayoutsTable from "../components/CarLayoutsTable";
    import CarLayoutDialog from "../components/CarLayoutDialog";
    import CarLayoutService from "../services/carLayoutService";

    export default {
        name: "CarLayouts",
        components: {CarLayoutDialog, GrayContainer, CarLayoutsTable},
        data() {
            return {
                printedCarLayoutDialog: false,
                printedCarLayout: { }
            }
        },
        methods: {
            onServerError(errorMessage) {
                this.$emit('serverError', errorMessage);
            },

            onShowCarLayout(carLayout) {
                this.printedCarLayout = CarLayoutService.transformFromMongo2FrontendModel(carLayout);
                this.printedCarLayoutDialog = true;
            },

            onChangeDialogState(newState) {
                this.printedCarLayoutDialog = newState;
            }
        }
    }
</script>
