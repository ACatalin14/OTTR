<template>
    <v-dialog
        ref="datePickerDialog"
        v-model="datePickerDialog"
        :return-value.sync="datePickerText"
        persistent
        width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                v-model="datePickerText"
                :label="label"
                :hide-details="hideDetails"
                :class="classes"
                :style="inlineStyle"
                :prepend-icon="prependIcon"
                readonly
                v-on="on"
                :rules="datePickerTextRules"
            ></v-text-field>
        </template>
        <v-date-picker
            v-if="datePickerDialog"
            v-model="datePickerText"
            scrollable
            :min="minDate"
        >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="datePickerDialog = false">Cancel</v-btn>
            <v-btn text color="primary"
                   @click="$refs.datePickerDialog.save(datePickerText)"
            >
                OK
            </v-btn>
        </v-date-picker>
    </v-dialog>
</template>

<script>
    export default {
        name: "DatePicker",
        props: {
            name: String,
            initialValue: String,
            label: {
                type: String,
                default: ''
            },
            requiredMessage: {
                type: String,
                default: ''
            },
            hideDetails: {
                type: Boolean,
                default: false
            },
            classes: {
                type: String,
                default: ''
            },
            inlineStyle: {
                type: String,
                default: ''
            },
            minDate: {
                type: String,
                default: ''
            },
            prependIcon: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                datePickerDialog: false,
                datePickerText: null,
                datePickerTextRules: []
            }
        },
        mounted() {
            this.datePickerTextRules.push(
                date => !!date || this.requiredMessage
            );

            if (this.initialValue && this.initialValue !== 'N/A') {
                this.datePickerText = this.initialValue;
            }
        },
        watch: {
            initialValue(newVal) {
                if (newVal && newVal !== 'N/A') {
                    this.datePickerText = newVal;
                } else {
                    this.datePickerText = null;
                }
            },

            datePickerText(newDate) {

                this.$emit('datePickerChanged', {
                    name: this.name,
                    newDate: newDate
                });
            }
        }
    }
</script>

<style scoped>

</style>