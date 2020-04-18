<template>
    <v-card flat>
        <v-card-text class="pl-7">
            <v-card class="mb-0">
                <v-card-title>
                    Ride creation options
                </v-card-title>
                <v-card-text>
                    <v-radio-group v-model="radioGenerateOption" class="mt-0">
                        <v-radio
                            label="Do not create any new rides for this route."
                            value="noGenerate"
                        ></v-radio>
                        <v-radio value="generateXFromY" class="mt-4">
                            <template v-slot:label>
                                <div>
                                    <v-row align="center" class="ml-0">
                                        <span>Create</span>
                                        <v-text-field
                                            v-model="noOfGeneratedRidesOption2"
                                            hide-details
                                            type="number"
                                            :rules="noOfGeneratedRidesRules"
                                            class="mx-3 my-0 py-0"
                                            style="width: 50px"
                                        ></v-text-field>
                                        <span>daily rides starting from</span>
                                        <v-dialog
                                            ref="dialogStartDateOption2"
                                            v-model="dialogStartDateOption2"
                                            :return-value.sync="dateStartStringOption2"
                                            persistent
                                            width="290px"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    v-model="dateStartStringOption2"
                                                    hide-details
                                                    readonly
                                                    v-on="on"
                                                    class="mx-3 my-0 py-0"
                                                    style="width: 100px;"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker
                                                v-model="dateStartStringOption2"
                                                scrollable
                                                :min="new Date().toISOString().substr(0, 10)"
                                            >
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="dialogStartDateOption2 = false">Cancel</v-btn>
                                                <v-btn text color="primary" @click="$refs.dialogStartDateOption2.save(dateStartStringOption2)">OK</v-btn>
                                            </v-date-picker>
                                        </v-dialog>
                                    </v-row>
                                </div>
                            </template>
                        </v-radio>
                        <v-radio value="generateBetween" class="mt-4">
                            <template v-slot:label>
                                <div>
                                    <v-row align="center" class="ml-0">
                                        <span>Create daily rides from</span>
                                        <DatePicker
                                            name="startDateOption3"
                                            :initial-value="new Date().toISOString().substr(0, 10)"
                                            :classes="'mx-3 mt-5 py-0'"
                                            :inline-style="'width: 90px;'"
                                            :min-date="new Date().toISOString().substr(0, 10)"
                                            @datePickerChanged="onDatePickerChanged($event)"
                                        >
                                        </DatePicker>
                                        <span>until</span>
                                        <DatePicker
                                            name="endDateOption3"
                                            :initial-value="dateEndStringOption3"
                                            :classes="'mx-3 mt-5 py-0'"
                                            :inline-style="'width: 90px;'"
                                            :min-date="dateStartStringOption3"
                                            @datePickerChanged="onDatePickerChanged($event)"
                                        >
                                        </DatePicker>
                                    </v-row>
                                </div>
                            </template>
                        </v-radio>
                    </v-radio-group>
                </v-card-text>
            </v-card>
        </v-card-text>
    </v-card>
</template>

<script>
    import DatePicker from "./DatePicker";

    export default {
        name: "RidesPanel",
        components: {
            DatePicker
        },
        props: {
            noOfGeneratedRides: Number,
            generateRidesFrom: Number,
            generateRidesUntil: Number
        },
        data() {
            return {
                radioGenerateOption: 'noGenerate',
                noOfGeneratedRidesOption2: 10,

                dialogStartDateOption2: false,
                dateStartStringOption2: new Date().toISOString().substr(0, 10),

                dateStartStringOption3: new Date().toISOString().substr(0, 10),
                dateEndStringOption3: new Date().toISOString().substr(0, 10),

                noOfGeneratedRidesRules: [
                    no => !!no || 'Required',
                    no => no > 0 || 'Must be greater than 0'
                ]
            }
        },

        watch: {
            radioGenerateOption(newOption) {

                switch (newOption) {
                    case 'noGenerate':
                        this.$emit('changedNoOfGeneratedRides', 0);
                        this.$emit('changedGenerateRidesFrom', null);
                        this.$emit('changedGenerateRidesUntil', null);
                        break;

                    case 'generateXFromY':
                        this.$emit('changedNoOfGeneratedRides', parseInt(this.noOfGeneratedRidesOption2));
                        this.$emit('changedGenerateRidesFrom', this.dateStartStringOption2);
                        this.$emit('changedGenerateRidesUntil', null);
                        break;

                    case 'generateBetween':
                        this.$emit('changedNoOfGeneratedRides', 0);
                        this.$emit('changedGenerateRidesFrom', this.dateStartStringOption3);
                        this.$emit('changedGenerateRidesUntil', this.dateEndStringOption3);
                        break;

                }
            },

            noOfGeneratedRidesOption2() {
                this.$emit('changedNoOfGeneratedRides', parseInt(this.noOfGeneratedRidesOption2));
            },

            dateStartStringOption2() {
                this.$emit('changedGenerateRidesFrom', this.dateStartStringOption2);
            },

            dateStartStringOption3() {
                this.$emit('changedGenerateRidesFrom', this.dateStartStringOption3);
            },

            dateEndStringOption3() {
                // this.dateEndStringOption3.setHours(23);
                // this.dateEndStringOption3.setMinutes(59);
                // this.dateEndStringOption3.setSeconds(59);
                // this.dateEndStringOption3.setMilliseconds(999);
                this.$emit('changedGenerateRidesUntil', this.dateEndStringOption3);
            }
        },

        methods: {
            onDatePickerChanged(event) {

                switch (event.name) {
                    case 'startDateOption2':
                        this.dateStartStringOption2 = event.newDate;
                        break;
                    case 'startDateOption3':
                        this.dateStartStringOption3 = event.newDate;

                        if (new Date(this.dateStartStringOption3) > new Date(this.dateEndStringOption3)) {
                            this.dateEndStringOption3 = this.dateStartStringOption3;
                        }

                        break;
                    case 'endDateOption3':
                        this.dateEndStringOption3 = event.newDate;
                        break;
                }
            }
        }
    }
</script>

<style scoped>

</style>