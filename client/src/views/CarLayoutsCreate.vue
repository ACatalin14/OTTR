<template>
    <GrayContainer>
        <v-row class="ma-0 pa-0">

            <h1 class="headline font-weight-black mt-2 pa-0"> New Car Layout</h1>
            <v-spacer></v-spacer>
            <v-btn
                v-if="$vuetify.breakpoint.smAndUp"
                color="error"
                outlined
                class="ma-0 mr-4"
                :to="{ name: 'carLayouts' }"
            >
                <strong>Cancel</strong>
            </v-btn>
            <v-btn
                v-if="$vuetify.breakpoint.smAndUp"
                color="primary"
                class="ma-0 mr-2"
                outlined
            >
                <strong>Save layout</strong>
            </v-btn>
            <v-btn
                v-if="$vuetify.breakpoint.xsOnly"
                color="error"
                icon
                :to="{ name: 'carLayouts' }"
            >
                <v-icon>mdi-cancel</v-icon>
            </v-btn>
            <v-btn
                v-if="$vuetify.breakpoint.xsOnly"
                color="primary"
                icon
            >
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <v-row>
            <v-col cols="12" md="3">
                <v-card class="fill-height">
                    <v-card-title> Car Properties </v-card-title>
                    <v-card-text class="px-0">
                        <v-text-field
                            v-model.number="carLayoutWidth"
                            label="Width (cells)"
                            :rules="carLayoutWidthRules"
                            type="number"
                            class="ml-5 mr-12"
                            prepend-icon="mdi-arrow-left-right"
                        ></v-text-field>
                        <v-text-field
                            v-model.number="carLayoutHeight"
                            label="Height (cells)"
                            :rules="carLayoutHeightRules"
                            type="number"
                            class="ml-5 mr-12"
                            prepend-icon="mdi-arrow-up-down"
                        ></v-text-field>
                        <v-text-field
                            v-model.number="cellSize"
                            label="Cell Size (pixels)"
                            :rules="cellSizeRules"
                            type="number"
                            class="ml-5 mr-12"
                            prepend-icon="mdi-arrow-expand"
                        ></v-text-field>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="9">
                <v-card class="fill-height pb-0">
                    <v-form
                        v-model="elementFormValid"
                        ref="elementForm"
                        lazy-validation
                        @submit.prevent="addNewElement"
                    >
                        <v-card-title class="">
                            New Layout Element
                        </v-card-title>
                        <v-card-text class="pb-0 mb-0">
                            <v-row class="ma-0 pa-0">
                                <v-col cols="12" md="6" class="ma-0 pa-0 pr-12">
                                    <v-select
                                        v-model="newElementType"
                                        :items="layoutElementTypes"
                                        menu-props="auto"
                                        label="Element Type"
                                        hide-details
                                        prepend-icon="mdi-shape-square-plus"
                                        class="mb-6"
                                        @change="updateElementFields()"
                                    ></v-select>
                                    <v-text-field
                                        :disabled="!checkElementTypeIsSeat(newElementType)"
                                        v-model.number="newElementSeatNumber"
                                        label="Seat Number"
                                        :rules="newSeatNumberRules"
                                        type="number"
                                        color="accent"
                                        prepend-icon="mdi-counter"
                                    ></v-text-field>
                                    <v-sheet color="#F2F2F2">
                                        <v-row justify="center" align="center" class="ma-0 pa-0"
                                               v-show="$vuetify.breakpoint.mdAndUp"
                                        >
                                            <v-col cols="2" class="ma-0 py-4">
                                                <v-img
                                                    :src="require('@/assets/' + newElementImagePath)"
                                                    alt="Element Image"
                                                    width="30"
                                                    transition="scale-transition"
                                                />
                                            </v-col>
                                        </v-row>
                                    </v-sheet>
                                </v-col>
                                <v-col cols="12" md="6" class="pa-0 pr-4 mb-0">
                                    <v-text-field
                                        v-model.number="newElementWidth"
                                        label="Element Width (cells)"
                                        :rules="newElementWidthRules"
                                        type="number"
                                        prepend-icon="mdi-arrow-left-right"
                                    ></v-text-field>
                                    <v-text-field
                                        v-model.number="newElementHeight"
                                        :disabled="shouldDisableNewElementHeight"
                                        label="Element Height (cells)"
                                        :rules="newElementHeightRules"
                                        type="number"
                                        prepend-icon="mdi-arrow-up-down"
                                    ></v-text-field>
                                    <v-sheet color="#F2F2F2">
                                        <v-row justify="center" align="center" class="ma-0 pa-0"
                                               v-show="$vuetify.breakpoint.smAndDown"
                                        >
                                            <v-col cols="3" class="ma-0 py-4">
                                                <v-img
                                                    :src="require('@/assets/' + newElementImagePath)"
                                                    alt="Element Image"
                                                    width="30"
                                                    class="ml-5 ml-sm-7"
                                                    transition="scale-transition"
                                                />
                                            </v-col>
                                        </v-row>
                                    </v-sheet>
                                    <v-row class="ma-0 pa-0">
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            color="accent"
                                            class="mt-3 mt-md-6 mb-3 text-capitalize"
                                            outlined
                                            @click="addNewElement()"
                                            :disabled="!elementFormValid || !getAvailablePosition() ||
                                            seatNumberAlreadyTaken()"
                                        >
                                            <strong>Add Element</strong>
                                        </v-btn>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-form>

                </v-card>
            </v-col>
        </v-row>

        <v-card class="mt-3" style="overflow: auto">
            <v-card-title>
                <p>Layout Result</p>
                <v-spacer></v-spacer>
                <v-btn
                    color="error"
                    outlined
                    @click="removeAllElements()"
                >
                    <strong>Remove all elements</strong>
                </v-btn>
            </v-card-title>
            <v-card-text align="center">
                <v-sheet
                    :width="sheetWidth"
                    :height="sheetHeight"
                    style="background: #F2F2F2"
                    class="pa-5"
                    align="left"
                >
                    <grid-layout
                        :layout.sync="gridLayout"
                        :col-num="carLayoutWidth"
                        :row-height="cellSize"
                        :is-draggable="true"
                        :is-resizable="true"
                        :is-mirrored="false"
                        :vertical-compact="false"
                        :margin="gridMargins"
                        :use-css-transforms="true"
                        :prevent-collision="true"
                        :isResizable="true"
                        :maxRows="carLayoutHeight"
                    >
                        <grid-item v-for="item in gridLayout"
                                   :x="item.x"
                                   :y="item.y"
                                   :w="item.w"
                                   :h="item.h"
                                   :i="item.i"
                                   :key="item.i"
                        >
                            <v-menu
                                v-model="item.showDeleteIcon"
                                top
                                :offset-x="true"
                                :nudge-top="item.h * cellSize - 10"
                                max-width="20"
                                open-on-click
                            >
                                <template v-slot:activator="{ on }">
                                    <v-img
                                        :src="require('@/assets/' + getPngNameFromType(item.type))"
                                        alt="Element Image"
                                        transition="scale-transition"
                                        :width=" item.w * cellSize + gridMargin * (item.w - 1) "
                                        :height=" item.h * cellSize + gridMargin * (item.h - 1) "
                                        v-on="on"
                                    >
                                        <div
                                            v-if="item.seatNumber"
                                            class="text elementContainer">
                                            <p class="ma-0 pa-0 centeredText"><strong>{{ item.seatNumber }}</strong></p>
                                        </div>
                                    </v-img>
                                </template>
                                <v-btn icon x-small color="error" @click="deleteElement(item.i)">
                                    <v-icon>mdi-cancel</v-icon>
                                </v-btn>
                            </v-menu>
                        </grid-item>
                    </grid-layout>
                </v-sheet>
            </v-card-text>
        </v-card>

    </GrayContainer>
</template>

<script>
    import GrayContainer from "../components/GrayContainer";
    import VueGridLayout from 'vue-grid-layout';

    export default {
        name: "CarLayoutCreate",
        components: {
            GrayContainer,
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem
        },
        data() {
            return {
                carLayoutWidth: 50,
                carLayoutHeight: 10,
                cellSize: 10,
                newElementType: 'Seat (left)',
                newElementWidth: 3,
                newElementHeight: 3,
                newElementSeatNumber: 10,
                newElementImagePath: 'seat-left.png',
                gridMargin: 2,
                elementFormValid: true,
                showDeleteIcon: false,
                lastElementId: 2,
                layoutElementTypes: [
                    'Seat (left)', 'Seat (right)', 'Seat (up)', 'Seat (down)', 'Luggage Rack', 'Table', 'Wall'
                ],
                carLayoutWidthRules: [
                    width => /^\d+$/.test(width) || 'Width must be an integer number',
                    width => width >= 10 || 'Width must be 10 or above',
                    width => width <= 1000 || 'Width must be 1000 or under'
                ],
                carLayoutHeightRules: [
                    height => /^\d+$/.test(height) || 'Height must be an integer number',
                    height => height >= 1 || 'Height must be 1 or above',
                    height => height <= 1000 || 'Height must be 1000 or under'
                ],
                cellSizeRules: [
                    cellSize => /^\d+$/.test(cellSize) || 'Size must be an integer number',
                    cellSize => cellSize >= 1 || 'Size must be 1 or above',
                    cellSize => cellSize <= 100 || 'Size must be 100 or under'
                ],
                newElementWidthRules: [
                    width => /^\d+$/.test(width) || 'Width must be an integer number',
                    width => width >= 1 || 'Width must be 1 or above',
                    width => width <= 100 || 'Width must be 100 or under'
                ],
                newElementHeightRules: [
                    height => /^\d+$/.test(height) || 'Height must be an integer number',
                    height => height >= 1 || 'Height must be 1 or above',
                    height => height <= 100 || 'Height must be 100 or under'
                ],
                newSeatNumberRules: [
                    seatNumber => /^\d+$/.test(seatNumber) || 'Size must be an integer number',
                    seatNumber => seatNumber >= 1 || 'Size must be 1 or above',
                    seatNumber => seatNumber <= 300 || 'Size must be 300 or under'
                ],
                gridLayout: [
                    {"x":0,"y":0,"w":2,"h":2,"i":0, type:'Seat (left)', seatNumber:123},
                    {"x":4,"y":0,"w":3,"h":3,"i":1, type:'Seat (up)', seatNumber:173},
                    {"x":9,"y":0,"w":5,"h":2,"i":2, type:'Table'},
                ]
            }
        },
        created() {

        },
        watch: {
            newElementWidth(newWidth) {
                if (this.checkElementTypeIsSquare(this.newElementType)) {
                    this.newElementHeight = newWidth;
                }
            }
        },
        computed: {
            shouldDisableNewElementHeight() {
                return this.checkElementTypeIsSquare(this.newElementType);
            },

            gridMargins() {
                return [this.gridMargin, this.gridMargin];
            },

            sheetWidth() {
                return this.cellSize * this.carLayoutWidth + this.gridMargin * (this.carLayoutWidth - 1)
                    + 2 * 4 * 5;   // plus padding
            },

            sheetHeight() {
                return this.cellSize * this.carLayoutHeight + this.gridMargin * (this.carLayoutHeight - 1)
                    + 2 * 4 * 5;
            }
        },
        methods: {
            checkElementTypeIsSeat(elementType) {
                return [
                    'Seat (left)',
                    'Seat (right)',
                    'Seat (up)',
                    'Seat (down)'
                ].includes(elementType);
            },

            checkElementTypeIsSquare(elementType) {
                return [
                    'Seat (left)',
                    'Seat (right)',
                    'Seat (up)',
                    'Seat (down)',
                    'Luggage Rack'
                ].includes(elementType);
            },

            updateElementFields() {

                this.newElementImagePath = this.getPngNameFromType(this.newElementType);

                if (this.checkElementTypeIsSquare(this.newElementType)) {
                    this.newElementHeight = this.newElementWidth;
                }

            },

            getPngNameFromType(elementType) {

                switch (elementType) {
                    case 'Seat (left)':
                        return 'seat-left.png';
                    case 'Seat (right)':
                        return 'seat-right.png';
                    case 'Seat (up)':
                        return 'seat-up.png';
                    case 'Seat (down)':
                        return 'seat-down.png';
                    case 'Luggage Rack':
                        return 'luggage-rack.png';
                    case 'Table':
                        return 'table.png';
                    case 'Wall':
                        return 'wall.png';
                    default:
                        return 'no-existing-png-for-this-type';
                }
            },

            addNewElement() {
                const availablePosition = this.getAvailablePosition();
                this.lastElementId++;
                const newElement = {
                    i: this.lastElementId,
                    x: availablePosition.x,
                    y: availablePosition.y,
                    w: this.newElementWidth,
                    h: this.newElementHeight,
                    type: this.newElementType
                };

                if (this.checkElementTypeIsSeat(newElement.type)) {
                    newElement.seatNumber = this.newElementSeatNumber;
                }

                console.log(newElement);

                this.gridLayout.push(newElement);
            },

            getAvailablePosition() {
                const rowLimit = this.carLayoutHeight - this.newElementHeight + 1;
                const colLimit = this.carLayoutWidth - this.newElementWidth + 1;

                for (let cornerRow = 0; cornerRow < rowLimit; cornerRow++) {
                    for (let cornerCol = 0; cornerCol < colLimit; cornerCol++) {

                        let collides = false;

                        for (let row = cornerRow; row < cornerRow + this.newElementHeight; row++) {
                            for (let col = cornerCol; col < cornerCol + this.newElementWidth; col++) {

                                for (let element of this.gridLayout) {

                                    if (row >= element.y && row <= element.y + element.h - 1 &&
                                        col >= element.x && col <= element.x + element.w - 1
                                    ) {
                                        collides = true;
                                        break;
                                    }
                                }

                                if (collides) {
                                    break;
                                }
                            }

                            if (collides) {
                                break;
                            }
                        }

                        if (!collides) {
                            return {
                                x: cornerCol,
                                y: cornerRow
                            };
                        }
                    }
                }

                return null;
            },

            deleteElement(id) {
                const index = this.gridLayout.findIndex( element => element.i === id );
                this.gridLayout.splice(index, 1);
            },

            removeAllElements() {
                this.gridLayout.splice(0, this.gridLayout.length);
            },

            seatNumberAlreadyTaken() {
                if (!this.checkElementTypeIsSeat(this.newElementType)) {
                    return false;
                }

                for (let element of this.gridLayout) {
                    if (element.seatNumber === this.newElementSeatNumber) {
                        return true;
                    }
                }

                return false;
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
</style>