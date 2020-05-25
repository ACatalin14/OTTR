<template>
    <v-sheet
        :width="carLayout.sheetWidth"
        :height="carLayout.sheetHeight"
        style="background: #F2F2F2"
        class="pa-5"
        align="left"
    >
        <grid-layout
            :layout.sync="carLayout.gridLayout"
            :col-num="carLayout.width"
            :row-height="carLayout.cellSize"
            :is-draggable="false"
            :is-resizable="false"
            :is-mirrored="false"
            :vertical-compact="false"
            :margin="gridMargins"
            :use-css-transforms="true"
            :prevent-collision="true"
            :isResizable="false"
            :maxRows="carLayout.height"
        >
            <grid-item v-for="item in carLayout.gridLayout"
                       :x="item.x"
                       :y="item.y"
                       :w="item.w"
                       :h="item.h"
                       :i="item.i"
                       :key="item.i"
            >
                <v-img
                    :src="require('@/assets/' + getPngNameFromElementType(item.type))"
                    alt="Element Image"
                    transition="scale-transition"
                    :width=" item.w * carLayout.cellSize + gridMargin * (item.w - 1) "
                    :height=" item.h * carLayout.cellSize + gridMargin * (item.h - 1) "
                    :class="{ 'hoverable-item': item.seatNumber && !isReserved(item.type) && !isReserving(item.type) }"
                    @click="toggleSeat(item)"
                >
                    <div
                        v-if="item.seatNumber"
                        class="text elementContainer"
                    >
                        <p class="ma-0 pa-0 centeredText"><strong>{{ item.seatNumber }}</strong></p>
                    </div>
                </v-img>
            </grid-item>
        </grid-layout>
    </v-sheet>
</template>

<script>
    import CONSTANTS from "../constants";
    import CarLayoutService from '../services/carLayoutService';

    export default {
        name: "CarLayoutWithSelectableSeats",
        props: {
            carLayout: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                gridMargin: CONSTANTS.LAYOUT.GRID_MARGIN
            }
        },
        computed: {
            gridMargins() {
                return [this.gridMargin, this.gridMargin];
            }
        },
        methods: {
            getPngNameFromElementType(elementType) {

                return CarLayoutService.getPngNameFromElementType(elementType);
            },

            toggleSeat(seatItem) {

                if (!seatItem.seatNumber) {
                    return;
                }

                if (this.isReserved(seatItem.type) || this.isReserving(seatItem.type)) {
                    return;
                }

                this.$emit('toggledSeat', seatItem.seatNumber);
            },

            isReserved(elementType) {

                return [
                    CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_LEFT,
                    CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_RIGHT,
                    CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_UP,
                    CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_DOWN
                ].includes(elementType);
            },

            isReserving(elementType) {

                return [
                    CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_LEFT,
                    CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_RIGHT,
                    CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_UP,
                    CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_DOWN
                ].includes(elementType);
            }
        }
    }
</script>

<style scoped>
    .elementContainer {
        height: 100%;
        position: relative;
    }

    .centeredText {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .hoverable-item {
        cursor: pointer;
    }
</style>