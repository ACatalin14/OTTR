<template>
    <v-dialog
        v-model="dialogState"
        :width="Math.max(300, responsiveCarLayout.sheetWidth + 2 * 4 * 5)"
    >
        <v-card style="overflow: auto">
            <v-card-title class="headline mb-1">
                <strong>{{ responsiveCarLayout.name }}</strong>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="ma-0 pa-5" align="center">
                <CarLayoutDisabledSheet
                    :car-layout="responsiveCarLayout"
                >
                </CarLayoutDisabledSheet>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import CarLayoutDisabledSheet from "./CarLayoutDisabledSheet";
    import CarLayoutService from "../services/carLayoutService";

    export default {
        name: "CarLayoutDialog",
        components: {CarLayoutDisabledSheet},
        props: {
            state: {
                type: Boolean,
                required: true
            },
            carLayout: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                dialogState: false
            }
        },
        computed: {
            responsiveCarLayout() {

                if (this.$vuetify.breakpoint.xsOnly) {
                    return CarLayoutService.rotateCarLayout(this.carLayout);
                }

                return this.carLayout;
            }
        },
        watch: {
            state(newState) {
                this.dialogState = newState;
            },

            dialogState(newState) {
                this.$emit('changeDialogState', newState);
            }
        }
    }
</script>

<style scoped>

</style>