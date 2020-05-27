<template>
    <GrayContainer>
        <v-dialog
            v-model="saveLayoutDialog"
            persistent
            max-width="600"
        >
            <v-card :loading="savingCarLayout">
                <v-form
                    v-model="saveLayoutFormValid"
                    ref="saveLayoutForm"
                    lazy-validation
                    @submit.prevent="saveLayout"
                >
                    <v-card-title>
                        <span class="headline">Save Car Layout</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="px-7">
                        <v-container>
                            <v-row no-gutters>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="newLayoutName"
                                        label="Layout Name"
                                        :rules="layoutNameRules"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" text @click="changeSaveLayoutDialogVisibility()">Cancel</v-btn>
                        <v-btn color="primary" text :disabled="!saveLayoutFormValid" type="submit">Save</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-row class="ma-0 pa-0">
            <h1 class="headline font-weight-black mt-2 pa-0"> {{ title }} </h1>
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
                :disabled="!layoutPropFormValid"
                @click="changeSaveLayoutDialogVisibility()"
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
                @click="changeSaveLayoutDialogVisibility()"
            >
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <v-row>
            <v-col cols="12" md="3">
                <v-card class="fill-height" :loading="editingCarLayout && loadingCarLayout">
                    <v-form
                        v-model="layoutPropFormValid"
                        ref="layoutPropForm"
                        lazy-validation
                    >
                        <v-card-title> Layout Properties </v-card-title>
                        <v-card-text class="px-0">
                            <v-text-field
                                v-model.number="carLayout.width"
                                label="Width (cells)"
                                :rules="carLayoutWidthRules"
                                type="number"
                                class="ml-5 mr-12"
                                prepend-icon="mdi-arrow-left-right"
                            ></v-text-field>
                            <v-text-field
                                v-model.number="carLayout.height"
                                label="Height (cells)"
                                :rules="carLayoutHeightRules"
                                type="number"
                                class="ml-5 mr-12"
                                prepend-icon="mdi-arrow-up-down"
                            ></v-text-field>
                            <v-text-field
                                v-model.number="carLayout.cellSize"
                                label="Cell Size (pixels)"
                                :rules="cellSizeRules"
                                type="number"
                                class="ml-5 mr-12"
                                prepend-icon="mdi-arrow-expand"
                            ></v-text-field>
                        </v-card-text>
                    </v-form>
                </v-card>
            </v-col>
            <v-col cols="12" md="9">
                <v-card class="fill-height pb-0" :loading="editingCarLayout && loadingCarLayout">
                    <v-form
                        v-model="elementFormValid"
                        ref="elementForm"
                        lazy-validation
                        @submit.prevent="addNewElement"
                    >
                        <v-card-title>
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
                                                >
                                                    <div
                                                        v-if="checkElementTypeIsSeat(newElementType)"
                                                        class="text elementContainer">
                                                        <p
                                                            class="ma-0 pa-0 centeredText">
                                                            <strong>{{ newElementSeatNumber }}</strong>
                                                        </p>
                                                    </div>
                                                </v-img>
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
                                                >
                                                    <div
                                                        v-if="checkElementTypeIsSeat(newElementType)"
                                                        class="text elementContainer">
                                                        <p
                                                            class="ma-0 pa-0 centeredText">
                                                            <strong>{{ newElementSeatNumber }}</strong>
                                                        </p>
                                                    </div>
                                                </v-img>
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

        <v-card class="mt-3" style="overflow: auto" :loading="editingCarLayout && loadingCarLayout">
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
                        :layout.sync="carLayout.gridLayout"
                        :col-num="colNum"
                        :maxRows="maxRows"
                        :row-height="rowHeight"
                        :is-draggable="true"
                        :is-resizable="true"
                        :is-mirrored="false"
                        :vertical-compact="false"
                        :margin="gridMargins"
                        :use-css-transforms="true"
                        :prevent-collision="true"
                    >
                        <grid-item v-for="item in carLayout.gridLayout"
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
                                :nudge-top="item.h * carLayout.cellSize + (item.h - 1) * gridMargin - 10"
                                max-width="20"
                                open-on-click
                            >
                                <template v-slot:activator="{ on }">
                                    <v-img
                                        :src="require('@/assets/' + getPngNameFromElementType(item.type))"
                                        alt="Element Image"
                                        transition="scale-transition"
                                        :width=" item.w * carLayout.cellSize + gridMargin * (item.w - 1) "
                                        :height=" item.h * carLayout.cellSize + gridMargin * (item.h - 1) "
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
    import CONSTANTS from "../constants";
    import CrudService from "../services/crudService";
    import CarLayoutService from "../services/carLayoutService";

    export default {
        name: "CarLayoutsForm",
        components: {
            GrayContainer,
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem
        },
        data() {
            return {
                service: CrudService.getCrudServiceForResource('car-layout'),
                savingCarLayout: false,
                loadingCarLayout: true,
                saveLayoutDialog: false,
                saveLayoutFormValid: true,
                layoutPropFormValid: true,
                editingCarLayout: false,
                carLayout: {
                    _id: null,
                    name: '',
                    seatingCapacity: 0,
                    width: 50,
                    height: 10,
                    cellSize: 10,
                    lastElementId: 0,
                    gridLayout: []
                },
                newLayoutName: '',
                newElementType: CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT,
                newElementWidth: 3,
                newElementHeight: 3,
                newElementSeatNumber: 10,
                newElementImagePath: 'seat-left.png',
                gridMargin: CONSTANTS.LAYOUT.GRID_MARGIN,
                elementFormValid: true,
                layoutElementTypes: [
                    { text: 'Seat (left)', value: CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT },
                    { text: 'Seat (right)', value: CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT },
                    { text: 'Seat (up)', value: CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP },
                    { text: 'Seat (down)', value: CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN },
                    { text: 'Luggage Rack', value: CONSTANTS.LAYOUT.ELEMENTS.LUGGAGE_RACK },
                    { text: 'Table', value: CONSTANTS.LAYOUT.ELEMENTS.TABLE },
                    { text: 'Wall', value: CONSTANTS.LAYOUT.ELEMENTS.WALL },
                ],
                layoutNameRules: [
                    name => !!name || 'Layout name is required',
                    name => name.length >= 3 || 'Layout name must have at least 3 characters'
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
                    seatNumber => /^\d+$/.test(seatNumber) || 'Seat number must be an integer number',
                    seatNumber => seatNumber >= 1 || 'Seat number must be 1 or above',
                    seatNumber => seatNumber < 1000 || 'Seat number must be under 1000',
                    seatNumber => !this.seatNumberAlreadyTaken(seatNumber) || 'Seat number already in use'
                ]
            }
        },
        async created() {
            if (this.$route.name === 'carLayoutsForm') {
                this.loadingCarLayout = false;
                return;
            }

            this.editingCarLayout = true;

            try {
                const dataBaseCarLayout = await CarLayoutService.getByName(this.$route.params.carLayoutName);

                this.carLayout._id = dataBaseCarLayout._id;
                this.carLayout.name = dataBaseCarLayout.name;
                this.carLayout.seatingCapacity = dataBaseCarLayout.seatingCapacity;
                this.carLayout.width = dataBaseCarLayout.width;
                this.carLayout.height = dataBaseCarLayout.height;
                this.carLayout.cellSize = dataBaseCarLayout.cellSize;
                this.carLayout.lastElementId = dataBaseCarLayout.lastElementId;

                this.carLayout.gridLayout = [];
                for (let item of dataBaseCarLayout.elements) {
                    this.carLayout.gridLayout.push(item);
                }


            } catch (error) {
                this.$emit('serverError', error.response.data.err.message);
                await this.$router.push({ name: 'carLayouts'});
            }

            this.loadingCarLayout = false;
        },
        watch: {
            newElementWidth(newWidth) {
                if (this.checkElementTypeIsSquare(this.newElementType)) {
                    this.newElementHeight = newWidth;
                }
            }
        },
        computed: {
            title() {
                return this.editingCarLayout ? 'Edit Car Layout' : 'New Car Layout';
            },

            shouldDisableNewElementHeight() {
                return this.checkElementTypeIsSquare(this.newElementType);
            },

            gridMargins() {
                return [this.gridMargin, this.gridMargin];
            },

            sheetWidth() {
                return this.carLayout.cellSize * this.carLayout.width + this.gridMargin * (this.carLayout.width - 1)
                    + 2 * 4 * 5;    // plus padding
            },

            sheetHeight() {
                return this.carLayout.cellSize * this.carLayout.height + this.gridMargin * (this.carLayout.height - 1)
                    + 2 * 4 * 5;    // plus padding
            },

            colNum() {
                return Number.isInteger(this.carLayout.width) ? this.carLayout.width : 0
            },

            maxRows() {
                return Number.isInteger(this.carLayout.height) ? this.carLayout.height : 0;
            },

            rowHeight() {
                return Number.isInteger(this.carLayout.cellSize) ? this.carLayout.cellSize : 0;
            }
        },
        methods: {
            checkElementTypeIsSeat(elementType) {
                return [
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT,
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT,
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP,
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN
                ].includes(elementType);
            },

            checkElementTypeIsSquare(elementType) {
                return [
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT,
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT,
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP,
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN,
                    CONSTANTS.LAYOUT.ELEMENTS.LUGGAGE_RACK
                ].includes(elementType);
            },

            updateElementFields() {

                this.newElementImagePath = this.getPngNameFromElementType(this.newElementType);

                if (this.checkElementTypeIsSquare(this.newElementType)) {
                    this.newElementHeight = this.newElementWidth;
                }

            },

            getPngNameFromElementType(elementType) {

                return CarLayoutService.getPngNameFromElementType(elementType);
            },

            addNewElement() {
                // we suppose there is an available position to add the element
                const availablePosition = this.getAvailablePosition();
                this.carLayout.lastElementId++;
                const newElement = {
                    i: this.carLayout.lastElementId,
                    x: availablePosition.x,
                    y: availablePosition.y,
                    w: this.newElementWidth,
                    h: this.newElementHeight,
                    type: this.newElementType
                };

                if (this.checkElementTypeIsSeat(newElement.type)) {
                    newElement.seatNumber = this.newElementSeatNumber;
                    this.carLayout.seatingCapacity++;
                }

                this.carLayout.gridLayout.push(newElement);

            },

            getAvailablePosition() {
                const rowLimit = this.carLayout.height - this.newElementHeight + 1;
                const colLimit = this.carLayout.width - this.newElementWidth + 1;

                for (let cornerRow = 0; cornerRow < rowLimit; cornerRow++) {
                    for (let cornerCol = 0; cornerCol < colLimit; cornerCol++) {

                        let collides = false;

                        for (let row = cornerRow; row < cornerRow + this.newElementHeight; row++) {
                            for (let col = cornerCol; col < cornerCol + this.newElementWidth; col++) {

                                for (let element of this.carLayout.gridLayout) {

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
                const index = this.carLayout.gridLayout.findIndex( element => element.i === id );

                if (this.checkElementTypeIsSeat(this.carLayout.gridLayout[index].type)) {
                    this.carLayout.seatingCapacity--;
                }

                this.carLayout.gridLayout.splice(index, 1);
            },

            removeAllElements() {
                this.carLayout.gridLayout.splice(0, this.carLayout.gridLayout.length);
                this.carLayout.seatingCapacity = 0;
            },

            seatNumberAlreadyTaken() {
                if (!this.checkElementTypeIsSeat(this.newElementType)) {
                    return false;
                }

                for (let element of this.carLayout.gridLayout) {
                    if (element.seatNumber === this.newElementSeatNumber) {
                        return true;
                    }
                }

                return false;
            },

            async saveLayout() {

                try {
                    if (!this.$refs.saveLayoutForm.validate()) {
                        this.saveLayoutFormValid = false;
                        return;
                    }

                    if (!this.$refs.layoutPropForm.validate()) {
                        this.layoutPropFormValid = false;
                        return;
                    }

                    const layoutToSave = {
                        _id: this.carLayout._id,
                        name: this.newLayoutName,
                        seatingCapacity: this.carLayout.seatingCapacity,
                        width: this.carLayout.width,
                        height: this.carLayout.height,
                        cellSize: this.carLayout.cellSize,
                        lastElementId: this.carLayout.lastElementId,
                        elements: []
                    };

                    for (let item of this.carLayout.gridLayout) {
                        let itemToSave = {
                            i: item.i,
                            x: item.x,
                            y: item.y,
                            w: item.w,
                            h: item.h,
                            type: item.type,
                            seatNumber: item.seatNumber
                        };

                        if (typeof itemToSave.seatNumber === 'undefined') {
                            delete itemToSave.seatNumber
                        }

                        layoutToSave.elements.push(itemToSave);
                    }

                    this.savingCarLayout = true;

                    if (this.editingCarLayout) {
                        await this.service.update(layoutToSave);
                        await this.$store.dispatch('showNotification', {
                            msg: 'Car Layout has been successfully saved.'
                        });
                    } else {
                        await this.service.create(layoutToSave);
                        await this.$store.dispatch('showNotification', {
                            msg: 'New Car Layout has been successfully created.'
                        });
                    }

                    this.saveLayoutDialog = false;

                    await this.$router.push({ name: 'carLayouts' });
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }

                this.savingCarLayout = false;
            },

            changeSaveLayoutDialogVisibility() {
                this.saveLayoutDialog = !this.saveLayoutDialog;

                if (!this.saveLayoutDialog) {
                    // We closed the save layout panel
                    return;
                }

                this.newLayoutName = this.carLayout.name;

                if (this.$refs.saveLayoutForm) {
                    this.$refs.saveLayoutForm.resetValidation();
                }
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